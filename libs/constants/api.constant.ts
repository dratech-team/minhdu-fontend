export const Api = {
  HR: {
    PAYROLL: {
      PAYROLL: 'v3/payroll',
      CONFIRM_PAYROLL: 'v3/payroll/payslip',
      RESTORE_PAYROLL: 'v3/payroll/restore',
      EXPORT: 'v3/payroll/export/payroll',
      PAYROLL_CREATE: 'v3/payroll/create',
      CHECKLIST: 'v3/payroll/checklist',
      GENERATE: 'v3/payroll/generate',
      OVERTIME: 'v3/payroll/overtime/filter',
      SALARY: 'v2/salaryv2',
      DEDUCTION_SALARY: 'v2/salary/deduction',
      ABSENT_SALARY: 'v2/salary/absent',
      OVERTIME_SALARY: 'v2/salary/overtime',
      ALLOWANCE_SALARY: 'v2/salary/allowance',
      SALARY_EMPLOYEES: 'v2/salary/employees',
      SALARY_REMOTE: 'v2/salary/remote',
      holiday: 'v2/holiday',
      PAYSLIP: 'v2/payslip',
      BRANCH_ALLOWANCE: 'v2/branch/allowance',
      GENERATE_HOLIDAY: 'v2/generate-holiday',
      ITEMS_EXPORT: 'v3/payroll/export/items',
      TEMPLATE_SALARY: 'v3/payroll/salary/template',
      CANCEL_CONFIRM: 'v3/payroll/cancel-payslip'

    },
    EMPLOYEE: {
      EMPLOYEE: 'v2/employee',
      DEGREE: 'v2/degree',
      RELATIVE: 'v2/relative',
      CONTRACT: 'v2/contract',
      POSITION: 'v2/position',
      BRANCH: 'v2/branch',
      DEPARTMENT: 'v2/department',
      EMPLOYEE_EXPORT: 'v2/employee/export/employee',
      CATEGORY: 'v2/category',
      SORT_STT: 'v2/employee/sort/stt',
      HISTORY_SALARY: 'v2/history/salary'
    },
    TEMPLATE: {
      BASIC_TEMPLATE: 'v2/permanent-template',
      OVERTIME_TEMPLATE: 'v2/overtime-template'
    },
    SETTING_SALARY:'v2/settings/salary',
    BLOCK_SETTING_SALARY:'v2/settings/salary-block',
    EXPORT:'v2/export',
    BRANCH_EXPORT: 'v2/payroll/export/branch',
    POSITION_EXPORT: 'v2/payroll/export/position',
    OVERVIEW: 'v2/overview/hr'
  },
  SELL: {
    OVERVIEW: 'v2/overview/sell',
    STATISTICAL: {
      STATISTICAL_AGENCY: 'v2/overview/agency',
      STATISTICAL_PROVINCE: 'v2/statistical/nation',
      STATISTICAL_CHICKEN: 'v2/statistical/chicken',
      STATISTICAL_CUSTOMER: 'v2/statistical/customer',
      STATISTICAL_AGENCY_PRINT: 'v2/statistical/agency/export/print',
      STATISTICAL_PROVINCE_PRINT: 'v2/statistical/nation/export/print',
      STATISTICAL_CHICKEN_PRINT: 'v2/statistical/chicken/export/print',
      STATISTICAL_CUSTOMER_PRINT: 'v2/statistical/customer/export/print'
    },
    CUSTOMER: {
      CUSTOMER: 'v2/customer',
      CUSTOMER_EXPORT: 'v2/customer/export/print',
      PAYMENT: 'v2/payment-history'
    },
    ORDER: {
      ORDER: 'v2/order',
      ORDER_HISTORY: 'v2/order-history',
      ORDER_EXPORT: 'v2/order/export/print'
    },
    ROUTE: {
      ROUTE: 'v2/route',
      ROUTE_EXPORT: 'v2/route/export/print'
    },
    COMMODITY: 'v2/commodity',
    COMMODITY_TEMPLATE: 'v2/commodity-template',
    BILL: 'v2/bill'
  },

  LOCATION: {
    NATION: 'v2/nation',
    PROVINCE: 'v2/province',
    DISTRICT: 'v2/district',
    WARD: 'v2/ward'
  },

  ORG_CHART: 'v2/org-chart',
  AUTH_SIGN_IN: 'v2/auth/signin',
  WAREHOUSE: {
    WAREHOUSE: 'v2/warehouse',
    PRODUCT: 'v2/product',
    SUPPLIER: 'v2/supplier',
    CONSIGNMENT: 'v2/consignment',
    IOI_RECEIPT: 'v2/ioi-receipt',
    STOCK:'v2/stock',
    HISTORY: 'v2/category-history'
  },
  BREED: {
    EGG_TYPE: 'v2/egg-type',
    EGG: 'v2/egg',
    INCUBATOR: 'v2/incubator',
  },
  ADMIN: {
    HR: 'v2/admin/hr'
  },
  LOGGER: 'v2/logger',
  SLACK_WEBHOOK:
    'https://hooks.slack.com/services/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',
  AUTH: 'v2/auth'
};
