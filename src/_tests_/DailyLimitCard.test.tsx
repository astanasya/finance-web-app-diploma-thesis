import { render, screen } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { DailyLimitCard } from '@/components/DailyLimitCard'

describe('DailyLimitCard Component', () => {
  test('відображає прогрес ліміту', () => {
    render(<DailyLimitCard limit={100} spentToday={40} monthlyTransactions={[]} />);
    
    // Перевіряємо чи відображаються цифри
    expect(screen.getByText(/40/)).toBeDefined();
    expect(screen.getByText(/100/)).toBeDefined();
  });

  test('показує "No limit set", якщо ліміт відсутній', () => {
    render(<DailyLimitCard limit={null} spentToday={0} monthlyTransactions={[]} />);
    
    // Текст залежить від твого коду, наприклад:
    expect(screen.getByText(/set/i)).toBeDefined();
  });
});