<?php

namespace Drupal\theme_front_master\Plugin\Preprocess;

/**
 * View Preprocess.
 */
abstract class RegionPreprocess {

  /**
   * Is Valid.
   *
   * @return bool
   *   Bool.
   */
  public function isValid($variables) {
    $class = str_replace('Drupal\theme_front_master\Preprocess\Region\\', '', get_class($this));
    $type_class = $this->transformTypeInClass($variables['region']);
    if (isset($variables['region']) && $type_class == $class) {
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
