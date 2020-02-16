<?php

namespace Drupal\theme_front_master\Plugin\Preprocess;

/**
 * View Preprocess.
 */
abstract class ViewPreprocess {

  /**
   * Is Valid.
   *
   * @return bool
   *   Bool.
   */
  public function isValid($variables, &$view) {
    $class = str_replace('Drupal\theme_front_master\Preprocess\View\\', '', get_class($this));
    $class = str_replace('Unformatted', '', $class);
    $type_class = $this->transformTypeInClass($variables['view']->id());
    if (isset($variables['view']) && $type_class == $class) {
      $view = $variables['view'];
      return TRUE;
    }
    return FALSE;
  }

  /**
   * Transform Type In class.
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
