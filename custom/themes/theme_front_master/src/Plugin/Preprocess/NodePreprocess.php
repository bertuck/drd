<?php

namespace Drupal\theme_front_master\Plugin\Preprocess;

/**
 * Node Preprocess.
 */
abstract class NodePreprocess {

  /**
   * Is Valid.
   *
   * @return bool
   *   Bool.
   */
  public function isValid($variables, &$node) {
    $class = str_replace('Drupal\theme_front_master\Preprocess\Node\\', '', get_class($this));
    $type_class = $this->transformTypeInClass($variables['node']->getType());
    if (isset($variables['node']) && $type_class == $class) {
      $node = $variables['node'];
      return TRUE;
    }
    return FALSE;
  }

  /**
   * Entity Type Query.
   *
   * @param string $entity_type
   *   Entity type.
   * @param string $bundle
   *   Bundle.
   *
   * @return mixed
   *   Mixed.
   */
  public function entityTypeQuery($entity_type, $bundle) {
    $query = \Drupal::entityQuery($entity_type);
    $query->entityCondition('entity_type', $entity_type)
      ->entityCondition('bundle', [$bundle]);
    return $query->execute();
  }

  /**
   * Get Field View Mode.
   *
   * @param array $variables
   *   Variables.
   * @param string $field_name
   *   Field Name.
   *
   * @return mixed
   *   Mixed.
   */
  public function getFieldViewMode(array $variables, $field_name) {
    $settings = [];
    $settings['view_mode'] = '';
    $info = field_info_instance('node', $field_name, $variables['node']->getType());
    $variables['view_mode'] = $variables['view_mode'] == 'full' ? 'default' : $variables['view_mode'];
    if (isset($info['display'][$variables['view_mode']]['settings'])) {
      $settings = $info['display'][$variables['view_mode']]['settings'];
    }
    return $settings['view_mode'];
  }

  /**
   * Transform Type In Class.
   *
   * @param string $type
   *   Type.
   *
   * @return string
   *   Classname.
   */
  private function transformTypeInClass($type) {
    $class = '';
    $items = explode('_', $type);
    if (count($items) <= 1) {
      $class = ucfirst($type);
      return $class;
    }
    for ($i = 0; $i < count($items); $i++) {
      $class .= ucfirst($items[$i]);
    }
    return $class;
  }

}
