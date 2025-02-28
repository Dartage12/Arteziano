<?php
header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $phone = htmlspecialchars($_POST['phone']);

    if (empty($name) || empty($phone)) {
        echo 'Пожалуйста, заполните все поля.';
        exit;
    }

    $to = 'Dartage2@yandex.ru'; // Ваш email
    $subject = 'Новая заявка на звонок';
    $message = "Имя: $name\nТелефон: $phone";
    $headers = 'From: no-reply@yourdomain.com' . "\r\n" .
               'Reply-To: no-reply@yourdomain.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    if (mail($to, $subject, $message, $headers)) {
        echo 'Ваша заявка успешно отправлена!';
    } else {
        echo 'Произошла ошибка при отправке заявки. Попробуйте ещё раз.';
    }
} else {
    echo 'Некорректный запрос.';
}
?>