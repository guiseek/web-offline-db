<?php
require_once __DIR__.'/vendor/autoload.php';

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Response;

$app = new Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => [
        'driver'  => 'pdo_mysql',
        'host'    => 'localhost',
        'port'    => '3306',
        'user'    => 'root',
        'password'  => 'root',
        'dbname'  => 'offline',
    ],
));

$app->get('/', function () use ($app) {
    return $app->json(['message' => 'Index']);
});
$app->get('/notes/{id}', function ($id) use ($app) {
    if ($id == null) {
        $notes = $app['db']->fetchAll('SELECT * FROM notes');
        return $app->json($notes, 200);
    }
    $note = $app['db']->fetchAssoc('SELECT * FROM notes WHERE id = :id', ['id' => $id]);
    if (!$note) {
        return $app->json(['message' => 'Nota não encontrada'], 404);
    }
    return $app->json($note, 200);
})->value('id', null);

$app->post('/notes', function(Request $request) use ($app) {
    $note = $request->request->get('note');
    $app['db']->insert('notes', ['note' => $note]);
    return $app->json(['message' => 'Nota cadastrada com sucesso'], 200);
});

$app->put('/notes/{id}', function(Request $request, $id) use ($app) {
    $note = $request->request->get('note');
    $updated = $request->request->get('updated');
    $find = $app['db']->fetchAssoc('SELECT id FROM notes WHERE id = :id', ['id' => $id]);
    if (!$find) {
        return $app->json(['message' => 'Nota não encontrada'], 404);
    }
    if ($find['updated'] < $updated) {
        $app['db']->update('notes', ['note' => $note, 'updated' => $updated], ['id' => $id]);
        return $app->json(['message' => 'Nota alterada com sucesso'], 200);
    }
    $app['db']->update('notes', ['note' => $note], ['id' => $id]);
    return $app->json(['message' => 'Nota alterada com sucesso'], 200);    
});

$app->delete('/notes/{id}', function(Request $request, $id) use ($app) {
    $find = $app['db']->fetchAssoc('SELECT id FROM notes WHERE id = :id', ['id' => $id]);
    if (!$find) {
        return $app->json(['message' => 'Nota não encontrada'], 404);
    }
    $app['db']->delete('notes', ['id' => $id]);
    return $app->json(['message' => 'Nota apagada com sucesso'], 200);
});

$app->error(function (\Exception $e, $code) {
    switch ($code) {
        case 404:
            $message = 'A página requisitada não foi encontrada. :/';
            break;
        default:
            $message = 'Desculpe, mas algo deu errado :(';
    }
    return new Response(['message' => $message], $code);
});

$app->match('/notes/{id}', function ($id, Request $request) use ($app) {
    return new Response('', 200, [
        'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' => 'Content-Type, Authorization'
    ]);
})->method('OPTIONS')->value('id', null);

$app->before(function (Request $request) use ($app) {
    if ($request->getMethod() == 'OPTIONS') {
        return;
    }
    if (!$request->headers->has('Authorization')){
        return $app->json(['message' => 'Acesso negado'], 401);
    }

    require_once __DIR__.'/configs/clients.php';
    if (!in_array($request->headers->get('Authorization'), array_keys($clients))) {
        return $app->json(['message' => 'Acesso negado'], 401);
    }

    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

$app->after(function (Request $request, Response $response) use ($app) {
    $response->headers->set('Access-Control-Allow-Origin', '*');
});

$app['debug'] = true;

$app->run();