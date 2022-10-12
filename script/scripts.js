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
    calcLabelExpenses.style.display = 'block';
    resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
  }
});

// Самозянятый калькулятор

const checkCompensation = () => {
  const setDisplay = formSelf.addCompensation.checked ? 'block' : 'none';

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