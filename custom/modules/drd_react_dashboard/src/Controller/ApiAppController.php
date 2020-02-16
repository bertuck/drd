<?php
namespace Drupal\drd_react_dashboard\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Drupal\user\Entity\User;
use Drupal\node\Entity\Node;

class ApiAppController extends ControllerBase {
    protected $entityTypeManager;

    public function __construct(EntityTypeManagerInterface $entityTypeManager) {
        $this->entityTypeManager = $entityTypeManager;
    }

    public static function create(ContainerInterface $container) {
        return new static (
            $container->get('entity_type.manager')
        );
    }

    public function getTotalNodesByType($uid) {
        if ($uid == 0) return new JsonResponse(['error' => $this->t('User not logged in')]);
        $response_array = array();
        $results = \Drupal::entityQueryAggregate('node')
            ->condition('uid', $uid)
            ->groupBy('type')
            ->aggregate('nid', 'COUNT')
            ->execute();
        if (!empty($results)) {
            $labels = [];
            $data = [];
            foreach ($results as $item) {
                $labels[] = $item['type'];
                $data[] = $item['nid_count'];
            }
            $response_array[] = [
                'labels' => $labels,
                'data' => $data,
            ];
        } else {
            $response_array = [];
        }
        return new JsonResponse($response_array);
    }

    public function getLikedNodes($uid) {
        if ($uid == 0) return new JsonResponse([]);
        $response_array = [];
        $user = User::load($uid);
        $flag_service = \Drupal::service('flag');
        $flag = $flag_service->getFlagById("greenclap");
        $query = \Drupal::entityQuery('node');
        $query->condition('status', 1);
        $nodes_ids = $query->execute();
        $nodes = Node::loadMultiple($nodes_ids);
        if (!empty($nodes)) {
            foreach ($nodes as $node) {
                if ($flag->isFlagged($node, $user)) {
                    $response_array[] = [
                        ['title' => 'Nid', 'type' => 'text', 'content' => $node->id()],
                        ['title' => 'Titre', 'type' => 'text', 'content' => $node->getTitle()],
                        ['title' => 'Type', 'type' => 'text', 'content' => $node->getType()],
                        ['title' => 'Lien', 'type' => 'link', 'content' => 'Voir', 'link' => $node->id()],
                        ['title' => '', 'type' => 'unflag', 'content' => $node->id()]
                    ];
                }
            }
        } else {
            $response_array = [];
        }
        return new JsonResponse($response_array);
    }

    // Unflag Node 
    public function unFlagNodes($uid, $nid){
        if ($uid == 0) return new JsonResponse(['error' => $this->t('User not logged in')]);
        $account = User::load($uid); // or load a specific user
        $flag_service = \Drupal::service('flag');
        $flag = $flag_service->getFlagById('greenclap'); // replace by flag machine name
        $node = \Drupal::entityTypeManager()->getStorage('node')->load($nid);

        // check if already flagged
        $flagging = $flag_service->getFlagging($flag, $node, $account);
        if ($flagging) {
            $flag_service->unflag($flag, $node, $account);
            $response_array[] = [
                'success' => $this->t('unFlagNodes : Unflagged.'),
            ];
        } else {
            $response_array[] = [
                'error' => $this->t('unFlagNodes : not flagged.'),
            ];
        }
        return new JsonResponse($response_array);
    }

    // Flag Node
    public function flagNodes($uid, $nid){
        if ($uid == 0) return new JsonResponse(['error' => $this->t('User not logged in')]);
        $account = User::load($uid); // or load a specific user
        $flag_service = \Drupal::service('flag');
        $flag = $flag_service->getFlagById('greenclap'); // replace by flag machine name
        $node = \Drupal::entityTypeManager()->getStorage('node')->load($nid);
        $flagging = $flag_service->getFlagging($flag, $node, $account);
        if (!$flagging) {
            $flag_service->flag($flag, $node, $account);
            $response_array[] = [
                'success' => $this->t('unFlagNodes : flagged.'),
            ];
        } else {
            $response_array[] = [
                'error' => $this->t('unFlagNodes : already flagged.'),
            ];
        }
        return new JsonResponse($response_array);
    }

    /**
     * @param int $limit
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse|null
     */
    public function getUsers($limit=1) {
        $response_array = array();
        $query =  \Drupal::entityQuery('user')
            ->condition('status', 1)
            ->range(0, $limit);
        $users = User::loadMultiple($query->execute());
        if (!empty($users)) {
            foreach ($users as $user) {
                $response_array[] = [
                    ['title' => 'Uid', 'type' => 'text', 'content' => $user->id()],
                    ['title' => 'Username', 'type' => 'text', 'content' => $user->getUsername()],
                ];
            }
        } else {
            $response_array = [];
        }
        return new JsonResponse($response_array);
    }


    public function getLastNodes($type, $uid, $limit = 10) {
        if ($uid == 0) return new JsonResponse([]);
        $response_array = [];
        $user = User::load($uid);
        $flag_service = \Drupal::service('flag');
        $flag = $flag_service->getFlagById("greenclap");
        $query =  \Drupal::entityQuery('node')
            ->condition('type', $type)
            ->sort('created', 'DESC')
            ->condition('status', 1)
            ->range(0, $limit);
        $nodes = Node::loadMultiple($query->execute());
        if (!empty($nodes)) {
            $index = 0;
            foreach ($nodes as $node) {
                $response_array[$index] = [
                    ['title' => 'Nid', 'type' => 'text', 'content' => $node->id()],
                    ['title' => 'Titre', 'type' => 'text', 'content' => $node->getTitle()],
                    ['title' => 'Mis à jour', 'type' => 'text', 'content' => \Drupal::service('date.formatter')->format($node->getChangedTime(), 'medium')],
                    ['title' => 'Lien', 'type' => 'link', 'content' => 'Voir', 'link' => $node->id()],
                ];
                if (in_array($type, $flag->getBundles()))
                    $response_array[$index][] = ['title' => '', 'type' => $flag->isFlagged($node, $user) ? 'unflag' : 'flag', 'content' => $node->id()];
                $index++;
            }
        } else {
            $response_array = [];
        }
        return new JsonResponse($response_array);
    }

    /**
     * @param int $nid
     *
     * @return mixed|null
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    public function getSimplePage($nid=1){
        $entity_type = 'node';
        $view_mode = 'full';
        $view_builder = \Drupal::entityTypeManager()->getViewBuilder($entity_type);
        $storage = \Drupal::entityTypeManager()->getStorage($entity_type);
        $node = $storage->load($nid);
        if (!empty($node)) {
            $build = $view_builder->view($node, $view_mode);
            $output = render($build);
            return new Response(
                $output,
                Response::HTTP_OK,
                array('content-type' => 'text/html')
            );
        }
        return new Response(
            null,
            Response::HTTP_OK,
            array('content-type' => 'text/html')
        );;
    }

}