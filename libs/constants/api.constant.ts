export const Api = {
  HR: {
    PAYROLL: {
      PAYROLL: 'payroll',
      CONFIRM_PAYROLL: 'payroll/confirm',
      RESTORE_PAYROLL: 'payroll/restore',
      EXPORT: 'payroll/export/payroll',
      PAYROLL_CREATE: 'payroll/create',
      CHECKLIST: 'payroll/checklist',
      GENERATE: 'payroll/generate',
      OVERTIME: 'payroll/overtime/filter',
      SALARY: 'salary',
      SALARY_EMPLOYEES: 'salary/employees',
      holiday: 'holiday',
      PAYSLIP: 'payslip',
      BRANCH_ALLOWANCE: 'branch/allowance',
      GENERATE_HOLIDAY: 'generate-holiday',
      ITEMS_EXPORT: 'payroll/export/items',
    },
    EMPLOYEE: {
      EMPLOYEE: 'employee',
      DEGREE: 'degree',
      RELATIVE: 'relative',
      CONTRACT: 'contract',
      POSITION: 'position',
      BRANCH: 'branch',
      DEPARTMENT: 'department',
      EMPLOYEE_EXPORT: 'payroll/export/employee',
    },
    TEMPLATE: {
      BASIC_TEMPLATE: 'basic-template',
      OVERTIME_TEMPLATE: 'overtime-template'
    },
    BRANCH_EXPORT: 'payroll/export/branch',
    POSITION_EXPORT: 'payroll/export/position',
    OVERVIEW : 'overview/hr'
  },
  SELL: {
    OVERVIEW: 'overview/sell',
    STATISTICAL:{
      STATISTICAL_AGENCY: 'overview/agency',
      STATISTICAL_PROVINCE: 'statistical/nation',
      STATISTICAL_CHICKEN: 'statistical/chicken',
      STATISTICAL_CUSTOMER: 'statistical/customer',
      STATISTICAL_AGENCY_PRINT: 'statistical/agency/export/print',
      STATISTICAL_PROVINCE_PRINT: 'statistical/nation/export/print',
      STATISTICAL_CHICKEN_PRINT: 'statistical/chicken/export/print',
      STATISTICAL_CUSTOMER_PRINT: 'statistical/customer/export/print',
    },
    CUSTOMER: {
      CUSTOMER: 'customer',
      CUSTOMER_EXPORT: 'customer/export/print',
      PAYMENT: 'payment-history',
    },
   ORDER:{
     ORDER: 'order',
     EXPORT_ITEMS: 'order/export/items',
     ORDER_EXPORT: 'order/export/print',

   },
    ROUTE:{
      ROUTE: 'route',
      ROUTE_EXPORT: 'route/export/print',
    },
    COMMODITY: 'commodity',
    BILL: 'bill'
  },

  LOCATION: {
    NATION: 'nation',
    PROVINCE: 'province',
    DISTRICT: 'district',
    WARD: 'ward'
  },

  ORG_CHART: 'org-chart',
  AUTH_SIGN_IN: 'auth/signin',
  WAREHOUSE: {
    MEDICINE: 'medicine',
    POULTRY_FOOD: 'poultryFood',
    PRODUCT: 'product',
    REQUISITE: 'requisite',
    MATERIAL: 'material'
  },
  ADMIN: {
    HR: 'admin/hr'
  },
  LOGGER: 'logger',
  SLACK_WEBHOOK:
    'https://hooks.slack.com/services/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',
  AUTH: 'auth'
};
