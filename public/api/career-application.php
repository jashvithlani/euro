<?php

declare(strict_types=1);

require_once __DIR__ . '/form-recipients.php';

function redirect_with_status(string $status): never
{
    header('Location: /career?careerApplication=' . rawurlencode($status) . '#career-application', true, 303);
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
    $filename = preg_replace('/[^A-Za-z0-9._-]/', '_', $filename) ?? 'resume.pdf';

    return $filename !== '' ? $filename : 'resume.pdf';
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
    'name',
    'email',
    'mobile',
    'date-of-birth',
    'position',
    'education',
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

$recipient = FORM_RECIPIENTS['career'] ?? '';
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('error');
}

$resume = $_FILES['resume'] ?? null;
if (!is_array($resume) || ($resume['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    redirect_with_status('error');
}

$resumeTmp = (string) ($resume['tmp_name'] ?? '');
$resumeName = clean_filename((string) ($resume['name'] ?? 'resume.pdf'));
$resumeSize = (int) ($resume['size'] ?? 0);
$resumeExtension = strtolower(pathinfo($resumeName, PATHINFO_EXTENSION));

if ($resumeTmp === '' || !is_uploaded_file($resumeTmp) || $resumeSize <= 0 || $resumeSize > 5 * 1024 * 1024 || $resumeExtension !== 'pdf') {
    redirect_with_status('error');
}

$labels = [
    'name' => 'Name',
    'email' => 'Email',
    'mobile' => 'Mobile',
    'date-of-birth' => 'Date of Birth',
    'position' => 'Position Applied For',
    'education' => 'Educational Qualification',
    'experience' => 'Experience',
    'expected-remuneration' => 'Expected Remunerations',
    'reference' => 'Reference',
    'message' => 'Message',
];

$lines = [
    'New career application from the Euro India Foods website.',
    '',
];

foreach ($labels as $key => $label) {
    $value = field($key);
    if ($value !== '') {
        $lines[] = $label . ': ' . $value;
    }
}

$resumeContents = file_get_contents($resumeTmp);
if ($resumeContents === false) {
    redirect_with_status('error');
}

$subject = 'New Career Application - Euro India Foods';
$safeName = clean_header_value(field('name'));
$safeEmail = clean_header_value($email);
$boundary = 'career_application_' . bin2hex(random_bytes(16));

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
$body .= "Content-Type: application/pdf; name=\"" . $resumeName . "\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n";
$body .= "Content-Disposition: attachment; filename=\"" . $resumeName . "\"\r\n\r\n";
$body .= chunk_split(base64_encode($resumeContents)) . "\r\n";
$body .= '--' . $boundary . "--\r\n";

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));

redirect_with_status($sent ? 'sent' : 'error');

