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
const taxReturn = document.querySelector('.tax-return');
const formTaxReturn = taxReturn.querySelector('.calc__form');
const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl');
const resultTaxPussible = taxReturn.querySelector('.result__tax_possible');
const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');

const formatCurrency = (number) => {
  const currency = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  })

  return currency.format(number);
}

const clear = () => {
  const resetBtn = document.querySelectorAll('.calc__btn-reset');
  const inputs = document.querySelectorAll("input[type='number']");

  resetBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      inputs.forEach((item) => {
        item.value = '';
      })
    });
  })
}

clear();

const debounceTimer = (fn, msec) => {
  let lastCall = 0;
  let lastCallTimer;

  return (...arg) => {
    const prevCall = lastCall;
    lastCall = Date.now;

    if (prevCall && ((lastCall - prevCall) <= msec)) {
      clearTimeout();
    }

    lastCallTimer = setTimeout(() => {
      fn(...arg);
    }, msec)
  }
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

formAusn.addEventListener('input', debounceTimer(() => {
  const income = +formAusn.income.value;
  if (formAusn.type.value === 'income') {
    calcLabelExpenses.style.display = 'none';
    resultTaxTotal.textContent = formatCurrency(income * 0.08);
  }

  if (formAusn.type.value === 'expenses') {
    calcLabelExpenses.style.display = '';
    const expenses = +formAusn.expenses.value;
    const profit = income < expenses ? 0 : income - expenses;
    resultTaxTotal.textContent = formatCurrency(profit * 0.2);
  }
}, 500));

// Самозянятый калькулятор

const checkCompensation = () => {
  const setDisplay = formSelf.addCompensation.checked ? '' : 'none';

  calcCompensation.style.display = setDisplay;

  resultBlockCompensation.forEach((elem) => {
    elem.style.display = setDisplay;
  })
};

checkCompensation();

formSelf.addEventListener('input', debounceTimer(() => {
  const individual = +formSelf.individual.value;
  const entity = +formSelf.entity.value;

  const resIndividual = individual * 0.04;
  const resEntity = entity * 0.06;
  const tax = resIndividual + resEntity;
  formSelf.compensation.value = +formSelf.compensation.value > 10_000 ? 10_000 : formSelf.compensation.value;
  const benefit = +formSelf.compensation.value;
  const resBenefit = individual * 0.01 + entity * 0.02;
  const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
  const finalTax = tax - (benefit - finalBenefit);

  checkCompensation();


  resultTaxTotalSelf.textContent = formatCurrency(tax);
  resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
  resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
  resultTaxResult.textContent = formatCurrency(finalTax);
}, 500));

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

formOsno.addEventListener('input', debounceTimer(() => {
  checkFormBusiness();

  const income = +formOsno.income.value;
  const expenses = +formOsno.expenses.value;
  const property = +formOsno.property.value;

  const nds = income * 0.2;
  const taxProperty = property * 0.02;
  const profit = income < expenses ? 0 : income - expenses;
  const ndflExpensesTotal = profit * 0.13;
  const ndflIncomeTotal = (income - nds) * 0.13;
  const taxProfit = profit * 0.2;

  resultTaxNds.textContent = formatCurrency(nds);
  resultTaxProperty.textContent = formatCurrency(taxProperty);
  resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
  resultTaxNdflIncome.textContent = formatCurrency(ndflIncomeTotal);
  resultTaxProfit.textContent = formatCurrency(taxProfit);
}, 500))

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

formUsn.addEventListener('input', debounceTimer(() => {
  checkShowProperty(formUsn.typeTax.value);

  const income = +formUsn.income.value;
  const expenses = +formUsn.expenses.value;
  const contributions = +formUsn.contributions.value;
  const property = +formUsn.property.value;

  let profit = income - contributions;

  if (formUsn.typeTax.value !== 'income') {
    profit -= expenses;
  }

  const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
  const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
  const tax = summ * percent[formUsn.typeTax.value];
  const resultTaxProperty = property * 0.02;

  taxTotal.textContent = formatCurrency(tax < 0 ? 0 : tax);
  taxProperty.textContent = formatCurrency(resultTaxProperty);
}, 500));

// 13 %

formTaxReturn.addEventListener('input', debounceTimer(() => {
  const expenses = +formTaxReturn.expenses.value;
  const income = +formTaxReturn.income.value;
  const sumExpenses = +formTaxReturn.sumExpenses.value;

  const ndfl = income * 0.13;
  const possibleDeduction = expenses < sumExpenses ? expenses * 0.13 : sumExpenses * 0.13;
  const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl;

  resultTaxNdfl.textContent = formatCurrency(ndfl);
  resultTaxPussible.textContent = formatCurrency(possibleDeduction);
  resultTaxDeduction.textContent = formatCurrency(deduction);
}, 500));