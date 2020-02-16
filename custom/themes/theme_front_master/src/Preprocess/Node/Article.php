<?php

namespace Drupal\theme_front_master\Preprocess\Node;

use Drupal\theme_front_master\Plugin\Preprocess\NodePreprocess;

/**
 * Article.
 */
class Article extends NodePreprocess {

  private $variables;
  private $node;

  /**
   * Construct.
   *
   * @param mixed $variables
   *   Variables.
   */
  public function __construct($variables) {
    $this->variables = $variables;
  }

  /**
   * Default or full content view mode.
   *
   * @return mixed
   *   Mixed.
   */
  public function run() {
    if ($this->isValid($this->variables, $this->node)) {
        //$this->setExampleMethod();
    }
    return $this->variables;
  }

  private function setExampleMethod() {
  }

  /**
   * Specific for view mode : Large.
   *
   * @return mixed
   *   Mixed.
   */
  public function runLarge() {
    if ($this->isValid($this->variables, $this->node)) {
      // $this->setExample();
    }
    return $this->variables;
  }
}
