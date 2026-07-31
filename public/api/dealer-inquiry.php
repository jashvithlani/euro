<?php

declare(strict_types=1);

require_once __DIR__ . '/form-recipients.php';

function redirect_with_status(string $status): never
{
    header('Location: /dealers?dealerInquiry=' . rawurlencode($status) . '#dealers-apply-title', true, 303);
    exit;
}

function field(string $key): string
{
    $value = $_POST[$key] ?? '';
    if (is_array($value)) {
        return '';
    }

    return trim((string) $value);
}

function clean_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

function clean_filename(string $filename): string
{
    $filename = basename($filename);
    $filename = preg_replace('/[^A-Za-z0-9._-]/', '_', $filename) ?? 'gst-certificate.pdf';

    return $filename !== '' ? $filename : 'gst-certificate.pdf';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method Not Allowed');
}

if (field('website') !== '') {
    redirect_with_status('sent');
}

$requiredFields = [
    'fullName',
    'email',
    'mobile',
    'address',
    'proprietor',
    'warehouse',
];

foreach ($requiredFields as $requiredField) {
    if (field($requiredField) === '') {
        redirect_with_status('error');
    }
}

$email = field('email');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('error');
}

$recipient = FORM_RECIPIENTS['dealers'] ?? '';
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('error');
}

$certificate = $_FILES['gst-certificate'] ?? null;
if (!is_array($certificate) || ($certificate['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    redirect_with_status('error');
}

$certificateTmp = (string) ($certificate['tmp_name'] ?? '');
$certificateName = clean_filename((string) ($certificate['name'] ?? 'gst-certificate.pdf'));
$certificateSize = (int) ($certificate['size'] ?? 0);
$extension = strtolower(pathinfo($certificateName, PATHINFO_EXTENSION));
$allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
$mimeType = match ($extension) {
    'png' => 'image/png',
    'jpg', 'jpeg' => 'image/jpeg',
    default => 'application/pdf',
};

if (
    $certificateTmp === ''
    || !is_uploaded_file($certificateTmp)
    || $certificateSize <= 0
    || $certificateSize > 5 * 1024 * 1024
    || !in_array($extension, $allowedExtensions, true)
) {
    redirect_with_status('error');
}

$labels = [
    'fullName' => 'Full Name',
    'email' => 'Email',
    'mobile' => 'Mobile',
    'state' => 'State',
    'address' => 'Address',
    'firm' => 'Firm Type',
    'proprietor' => 'Name of Proprietor',
    'since' => 'Operating Since Years',
    'warehouse' => 'Warehouse Capacity',
    'business' => 'Type of Business',
    'town' => 'Town/Territory Cover',
    'message' => 'Message',
];

$lines = [
    'New dealer inquiry from the Euro India Foods website.',
    '',
];

foreach ($labels as $key => $label) {
    $value = field($key);
    if ($value !== '') {
        $lines[] = $label . ': ' . $value;
    }
}

$certificateContents = file_get_contents($certificateTmp);
if ($certificateContents === false) {
    redirect_with_status('error');
}

$subject = 'New Dealer Inquiry - Euro India Foods';
$safeName = clean_header_value(field('fullName'));
$safeEmail = clean_header_value($email);
$boundary = 'dealer_inquiry_' . bin2hex(random_bytes(16));

$headers = [
    'MIME-Version: 1.0',
    'From: Euro India Foods Website <jashvithlani56@gmail.com>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
    'X-Mailer: PHP/' . phpversion(),
];

$body = '--' . $boundary . "\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= implode("\n", $lines) . "\r\n\r\n";
$body .= '--' . $boundary . "\r\n";
$body .= "Content-Type: " . $mimeType . "; name=\"" . $certificateName . "\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n";
$body .= "Content-Disposition: attachment; filename=\"" . $certificateName . "\"\r\n\r\n";
$body .= chunk_split(base64_encode($certificateContents)) . "\r\n";
$body .= '--' . $boundary . "--\r\n";

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));

redirect_with_status($sent ? 'sent' : 'error');

