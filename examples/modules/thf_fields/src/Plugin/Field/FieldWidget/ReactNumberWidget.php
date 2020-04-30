<?php

namespace Drupal\thf_fields\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldFilteredMarkup;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\Validator\ConstraintViolationInterface;

/**
 * Plugin implementation of the 'react_number' widget.
 *
 * @FieldWidget(
 *   id = "react_number",
 *   label = @Translation("React Slider Number field"),
 *   field_types = {
 *     "float",
 *     "integer"
 *   }
 * )
 */
class ReactNumberWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'placeholder' => '',
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $element['placeholder'] = [
      '#type' => 'textfield',
      '#title' => t('Placeholder'),
      '#default_value' => $this->getSetting('placeholder'),
      '#description' => t('Text that will be shown inside the field until a value is entered. This hint is usually a sample value or a brief description of the expected format.'),
    ];
    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];

    $placeholder = $this->getSetting('placeholder');
    if (!empty($placeholder)) {
      $summary[] = t('Placeholder: @placeholder', ['@placeholder' => $placeholder]);
    }
    else {
      $summary[] = t('No placeholder');
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $value = isset($items[$delta]->value) ? $items[$delta]->value : NULL;
    $field_settings = $this->getFieldSettings();

    $element += [
      '#type' => 'number',
      '#default_value' => $value,
      '#placeholder' => $this->getSetting('placeholder'),
      '#theme' => 'input__number__react',
    ];

    $element['#attached']['library'][] = 'thf_fields/react-slider';

    // Set the step for floating point and decimal numbers.
    switch ($this->fieldDefinition->getType()) {
      case 'decimal':
        $element['#step'] = pow(0.1, $field_settings['scale']);
        break;

      case 'float':
        $element['#step'] = 'any';
        break;
    }

    // Set minimum and maximum.
    if (is_numeric($field_settings['min'])) {
      $element['#min'] = $field_settings['min'];
    }
    if (is_numeric($field_settings['max'])) {
      $element['#max'] = $field_settings['max'];
    }

    // Add prefix and suffix.
    if ($field_settings['prefix']) {
      // $prefixes = explode('|', $field_settings['prefix']);
      // $element['#field_prefix'] = FieldFilteredMarkup::create(array_pop($prefixes));
      $element['#react_prefix'] = $field_settings['prefix'];
    }
    if ($field_settings['suffix']) {
      // $suffixes = explode('|', $field_settings['suffix']);
      // $element['#field_suffix'] = FieldFilteredMarkup::create(array_pop($suffixes));
      $element['#react_suffix'] = $field_settings['suffix'];
    }

    return ['value' => $element];
  }

  /**
   * {@inheritdoc}
   */
  public function errorElement(array $element, ConstraintViolationInterface $violation, array $form, FormStateInterface $form_state) {
    return $element['value'];
  }

}
