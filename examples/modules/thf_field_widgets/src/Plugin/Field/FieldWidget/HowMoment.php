<?php

namespace Drupal\thf_field_widgets\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'react_number' widget.
 *
 * @FieldWidget(
 *   id = "how_moment",
 *   label = @Translation("How Moment"),
 *   field_types = {
 *     "string_long",
 *   }
 * )
 */
class HowMoment extends WidgetBase {

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
      '#theme' => 'input__how_moment',
      '#existing_nid' => $form_state->getFormObject()->getEntity()->id(),
    ];

    $element['#attached']['library'][] = 'thf_field_widgets/how_moment';

    return ['value' => $element];
  }

}
