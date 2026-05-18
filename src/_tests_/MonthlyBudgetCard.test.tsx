import { render, screen } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { MonthlyBudgetCard } from '@/components/budget/MonthlyBudgetCard'

describe('MonthlyBudgetCard Component', () => {
  test('правильно відображає відсоток ліміту', () => {
    // Дані: бюджет 1000, витрачено 600 (має бути 60%)
    render(<MonthlyBudgetCard totalBudget={1000} totalSpent={600} />);
    
    // Перевіряємо чи є текст "60% spent" (або як у тебе в коді)
    expect(screen.getByText(/60%/i)).toBeDefined();
  });

  test('відображає суму залишку', () => {
    render(<MonthlyBudgetCard totalBudget={1000} totalSpent={250} />);
    
    // Має бути $750 залишку
    expect(screen.getByText(/750/)).toBeDefined();
  });
});