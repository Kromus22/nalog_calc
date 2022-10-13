const LIMIT = 300_000;
const navigationLinks = document.querySelectorAll('.navigation__link');
const calcElems = document.querySelectorAll('.calc');
const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxTotal = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');
const self = document.querySelector('.self-employment');
const formSelf = self.querySelector('.calc__form');
const resultTaxTotalSelf = self.querySelector('.result__tax_total');
const calcCompensation = self.querySelector('.calc__label_compensation');
const resultBlockCompensation = self.querySelectorAll('.result__block_compensation');
const resultTaxCompensation = self.querySelector('.result__tax_compensation');
const resultTaxRestCompensation = self.querySelector('.result__tax_rest-compensation');
const resultTaxResult = self.querySelector('.result__tax_result');
const osno = document.querySelector('.osno');
const formOsno = osno.querySelector('.calc__form');
const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
const ndflIncome = osno.querySelector('.result__block_ndfl-income');
const profit = osno.querySelector('.result__block_profit');
const resultTaxNds = osno.querySelector('.result__tax_nds');
const resultTaxProperty = osno.querySelector('.result__tax_property');
const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
const resultTaxProfit = osno.querySelector('.result__tax_profit');
const usn = document.querySelector('.usn');
const formUsn = usn.querySelector('.calc__form');
const labelExpenses = usn.querySelector('.calc__label_expenses');
const labelProperty = usn.querySelector('.calc__label_property');
const resultBlockProperty = usn.querySelector('.result__block_property');
const taxTotal = usn.querySelector('.result__tax_total');
const taxProperty = usn.querySelector('.result__tax_property');

const formatCurrency = (number) => {
  const currency = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  })

  return currency.format(number);
}


for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener('click', (e) => {
    e.preventDefault();

    for (let j = 0; j < calcElems.length; j++) {
      if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
        calcElems[j].classList.add('calc_active');
        navigationLinks[i].classList.add('navigation__link_active');
      } else {
        calcElems[j].classList.remove('calc_active');
        navigationLinks[j].classList.remove('navigation__link_active');
      }
    }
  })
}

// АУСН калькулятор

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', () => {
  if (formAusn.type.value === 'income') {
    calcLabelExpenses.style.display = 'none';
    resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
  }

  if (formAusn.type.value === 'expenses') {
    calcLabelExpenses.style.display = '';
    resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
  }
});

// Самозянятый калькулятор

const checkCompensation = () => {
  const setDisplay = formSelf.addCompensation.checked ? '' : 'none';

  calcCompensation.style.display = setDisplay;

  resultBlockCompensation.forEach((elem) => {
    elem.style.display = setDisplay;
  })
};

checkCompensation();

formSelf.addEventListener('input', () => {
  const resIndividual = formSelf.individual.value * 0.04;
  const resEntity = formSelf.entity.value * 0.06;
  const tax = resIndividual + resEntity;
  formSelf.compensation.value = formSelf.compensation.value > 10_000 ? 10_000 : formSelf.compensation.value;
  const benefit = formSelf.compensation.value;
  const resBenefit = formSelf.individual.value * 0.01 + formSelf.entity.value * 0.02;
  const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
  const finalTax = tax - (benefit - finalBenefit);

  checkCompensation();


  resultTaxTotalSelf.textContent = formatCurrency(tax);
  resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
  resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
  resultTaxResult.textContent = formatCurrency(finalTax);
});

// ОСНО калькулятор

const checkFormBusiness = () => {
  if (formOsno.formBusiness.value === 'ИП') {
    ndflExpenses.style.display = '';
    ndflIncome.style.display = '';
    profit.style.display = 'none';
  }

  if (formOsno.formBusiness.value === 'ООО') {
    ndflExpenses.style.display = 'none';
    ndflIncome.style.display = 'none';
    profit.style.display = '';
  }
};

checkFormBusiness();

formOsno.addEventListener('input', () => {
  checkFormBusiness();

  const income = formOsno.income.value;
  const expenses = formOsno.expenses.value;
  const property = formOsno.property.value;

  const nds = income * 0.2;
  const taxProperty = property * 0.02;
  const profit = income - expenses;
  const ndflExpensesTotal = profit * 0.13;
  const ndflIncomeTotal = (income - nds) * 0.13;
  const taxProfit = profit * 0.2;

  resultTaxNds.textContent = formatCurrency(nds);
  resultTaxProperty.textContent = formatCurrency(taxProperty);
  resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
  resultTaxNdflIncome.textContent = formatCurrency(ndflIncomeTotal);
  resultTaxProfit.textContent = formatCurrency(taxProfit);
})

// УСН калькулятор

const checkShowProperty = (typeTax) => {
  switch (typeTax) {
    case 'income': {
      labelExpenses.style.display = 'none';
      labelProperty.style.display = 'none';
      resultBlockProperty.style.display = 'none';

      formUsn.expenses.value = '';
      formUsn.property.value = '';

      break
    };
    case 'ip-expenses': {
      labelExpenses.style.display = '';
      labelProperty.style.display = 'none';
      resultBlockProperty.style.display = 'none';

      formUsn.property.value = '';
      break
    };
    case 'ooo-expenses': {
      labelExpenses.style.display = '';
      labelProperty.style.display = '';
      resultBlockProperty.style.display = '';
      break
    };
  }
};

checkShowProperty(formUsn.typeTax.value);

const percent = {
  'income': 0.06,
  'ip-expenses': 0.15,
  'ooo-expenses': 0.15,
}

formUsn.addEventListener('input', () => {
  checkShowProperty(formUsn.typeTax.value);

  const income = formUsn.income.value;
  const expenses = formUsn.expenses.value;
  const contributions = formUsn.contributions.value;
  const property = formUsn.property.value;

  let profit = income - contributions;

  if (formUsn.typeTax.value !== 'income') {
    profit -= expenses;
  }

  const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
  const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
  const tax = summ * percent[formUsn.typeTax.value];
  const resultTaxProperty = property * 0.02;

  taxTotal.textContent = formatCurrency(tax);
  taxProperty.textContent = formatCurrency(resultTaxProperty);
});