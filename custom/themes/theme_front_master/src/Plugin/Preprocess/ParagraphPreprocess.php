<?php

namespace Drupal\theme_front_master\Plugin\Preprocess;

/**
 * Paragraph Preprocess.
 */
abstract class ParagraphPreprocess {

  /**
   * Get Field View Mode.
   *
   * @param array $variables
   *   Variables.
   * @param string $field_name
   *   Field name.
   *
   * @return mixed
   *   Mixed.
   */
  public function getFieldViewMode(array $variables, $field_name) {
    $settings = [];
    $settings['view_mode'] = '';
    $info = field_info_instance('paragraph_item', $field_name, $variables['paragraphs_item']->bundle);
    $variables['view_mode'] = $variables['view_mode'] == 'full' ? 'default' : $variables['view_mode'];
    if (isset($info['display'][$variables['view_mode']]['settings'])) {
      $settings = $info['display'][$variables['view_mode']]['settings'];
    }
    return $settings['view_mode'];
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
   * Is Valid.
   *
   * @param array $variables
   *   Variables.
   * @param mixed $paragraph
   *   Paragraph.
   *
   * @return bool
   *   Bool.
   */
  public function isValid($variables, &$paragraph) {
      if (!empty($variables) && !empty($paragraph)) {
          $class = str_replace('Drupal\theme_front_master\Preprocess\Paragraph\\', '', get_class($this));
          $type_class = $this->transformTypeInClass($variables['paragraph']->getType());
          if (isset($variables['paragraph']) && $type_class == $class) {
              $paragraph = $variables['paragraph'];
              return TRUE;
          }
          return FALSE;
      }
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
