<?php
namespace Drupal\drd_react_dashboard\Controller;

use Drupal\Core\Controller\ControllerBase;

class DashboardAppController extends ControllerBase {

    public function view() {
        global $user;
        $build = [];
        $build['#attached']['library'][] = 'theme_front_master/react-dashboard-theme';
        $build['#attached']['library'][] = 'theme_front_master/react-dashboard-scripts';
        $user = \Drupal::currentUser();
        $uid = $user ? $user->id() : '0';
        $build['#attached']['drupalSettings']['currentUser']['uid'] = \Drupal::currentUser()->id();
        $build['#attached']['drupalSettings']['currentUser']['name'] = \Drupal::currentUser()->getAccountName();
        $build['#markup'] = '<div id="root"></div>';
        return $build;
    }
}