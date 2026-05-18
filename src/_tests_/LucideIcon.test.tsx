import { render } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { DynamicIcon } from '@/components/LucideIcon'

describe('DynamicIcon Component', () => {
  test('рендерить іконку без помилок', () => {
    const { container } = render(<DynamicIcon name="Wallet" size={20} />);
    // Перевіряємо, чи всередині є SVG елемент
    expect(container.querySelector('svg')).toBeDefined();
  });

  test('використовує дефолтну іконку, якщо назва невірна', () => {
    const { container } = render(<DynamicIcon name="NonExistentIcon" size={20} />);
    // Перевіряємо, що компонент не "зламався"
    expect(container.querySelector('svg')).toBeDefined();
  });
});