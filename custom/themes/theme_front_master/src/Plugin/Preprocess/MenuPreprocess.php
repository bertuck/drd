<?php

namespace Drupal\theme_front_master\Plugin\Preprocess;

/**
 * Node Preprocess.
 */
abstract class MenuPreprocess {

  /**
   * Is Valid.
   *
   * @return bool
   *   Bool.
   */
  public function isValid($variables) {
    $class = str_replace('Drupal\theme_front_master\Preprocess\Menu\\', '', get_class($this));
    $type_class = $this->transformTypeInClass($variables['menu_name']);
    if (isset($variables['menu_name']) && $type_class == $class) {
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
