<?php

namespace Drupal\theme_front_master\Plugin\Preprocess;

/**
 * TaxonomyPreprocess.
 */
abstract class TaxonomyPreprocess {

  /**
   * Get Field View Mode.
   *
   * @param array $variables
   *   Variables.
   * @param string $field_name
   *   Field name.
   *
   * @return mixed
   *   Mixed
   */
  public function getFieldViewMode(array $variables, $field_name) {
    $info = field_info_instance('taxonomy_term', $field_name, $variables['vocabulary_machine_name']);
    if (isset($variables['view_mode']) && isset($info['display'][$variables['view_mode']]['settings'])) {
      $settings = $info['display'][$variables['view_mode']]['settings'];
    }
    return isset($settings['view_mode']) ? $settings['view_mode'] : '';
  }

  /**
   * Entity Type Query.
   *
   * @param string $entity_type
   *   Entity Type.
   * @param string $bundle
   *   Bundle.
   *
   * @return mixed
   *   Mixed
   */
  public function entityTypeQuery($entity_type, $bundle) {
    $query = \Drupal::entityQuery($entity_type);
    $query->entityCondition('entity_type', $entity_type)
      ->entityCondition('bundle', [$bundle]);
    return $query->execute();
  }

  /**
   * Is Valid.
   *
   * @param array $variables
   *   Variables.
   * @param mixed $term
   *   Term.
   *
   * @return bool
   *   Bool.
   */
  public function isValid(array $variables, &$term) {
    $class = str_replace('Drupal\theme_front_master\Preprocess\Taxonomy\\', '', get_class($this));
    $type_class = $this->transformTypeInClass($variables['term']->bundle());
    if (isset($variables['term']) && $type_class == $class) {
      $term = $variables;
      return TRUE;
    }
    return FALSE;
  }

  /**
   * Transform Type In Class.
   *
   * @param string $type
   *   Type.
   *
   * @return string
   *   String.
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
