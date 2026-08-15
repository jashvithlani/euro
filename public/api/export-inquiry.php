<?php

declare(strict_types=1);

require_once __DIR__ . '/form-recipients.php';

function redirect_with_status(string $status): never
{
    header('Location: /exports?exportInquiry=' . rawurlencode($status) . '#export-inquiry-title', true, 303);
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
    'country',
    'address',
    'state',
    'firm-type',
    'proprietor',
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

$recipient = FORM_RECIPIENTS['exports'] ?? '';
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('error');
}

$labels = [
    'name' => 'Name',
    'email' => 'Email',
    'mobile' => 'Mobile',
    'country' => 'Country',
    'address' => 'Address',
    'state' => 'State',
    'firm-type' => 'Firm Type',
    'proprietor' => 'Name Of Proprietor',
    'operating-since' => 'Operating Since Years',
    'business-type' => 'Type Of Business',
    'message' => 'Message',
];

$lines = [
    'New export partnership inquiry from the Euro India Foods website.',
    '',
];

foreach ($labels as $key => $label) {
    $value = field($key);
    if ($value !== '') {
        $lines[] = $label . ': ' . $value;
    }
}

$subject = 'New Export Inquiry - Euro India Foods';
$body = implode("\n", $lines);
$safeName = clean_header_value(field('name'));
$safeEmail = clean_header_value($email);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Euro India Foods Website <info@euroindiafoods.com>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));

redirect_with_status($sent ? 'sent' : 'error');

