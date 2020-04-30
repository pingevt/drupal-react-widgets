<?php

namespace Drupal\thf_field_widgets\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'react_number' widget.
 *
 * @FieldWidget(
 *   id = "hero_network",
 *   label = @Translation("Hero Network"),
 *   field_types = {
 *     "string_long",
 *   }
 * )
 */
class HeroNetwork extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'max_number' => '',
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $element['max_number'] = [
      '#type' => 'number',
      '#title' => $this->t('Max connections'),
      '#default_value' => $this->getSetting('max_number'),
      '#description' => $this->t('Max number of connections.'),
    ];
    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];

    $placeholder = $this->getSetting('max_number');
    if (!empty($placeholder)) {
      $summary[] = $this->t('Max Connections: @max_number', ['@max_number' => $placeholder]);
    }
    else {
      $summary[] = $this->t('No Connections');
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {

    $value = isset($items[$delta]->value) ? $items[$delta]->value : NULL;
    // phpcs:ignore
    // $field_settings = $this->getFieldSettings();

    $element += [
      '#type' => 'textarea',
      '#default_value' => $value,
      '#theme' => 'input__hero_network',
      '#existing_nid' => $form_state->getFormObject()->getEntity()->id(),
      '#max_connections' => $this->getSetting('max_number'),
    ];

    $element['#attached']['library'][] = 'thf_field_widgets/how_moment';

    return ['value' => $element];
  }

}
