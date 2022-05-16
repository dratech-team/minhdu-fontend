export const Api = {
  HR: {
    PAYROLL: {
      PAYROLL: 'payroll',
      CONFIRM_PAYROLL: 'payroll/payslip',
      RESTORE_PAYROLL: 'payroll/restore',
      EXPORT: 'payroll/export/payroll',
      PAYROLL_CREATE: 'payroll/create',
      CHECKLIST: 'payroll/checklist',
      GENERATE: 'payroll/generate',
      OVERTIME: 'payroll/overtime/filter',
      SALARY: 'salaryv2',
      DEDUCTION_SALARY: 'salary/deduction',
      DAY_OFF_SALARY: 'salary/dayoff',
      ABSENT_SALARY: 'salary/absent',
      OVERTIME_SALARY: 'salary/overtime',
      ALLOWANCE_SALARY: 'salary/allowance',
      SALARY_EMPLOYEES: 'salary/employees',
      SALARY_REMOTE: 'salary/remote',
      SALARY_HOLIDAY: 'salary/holiday',
      holiday: 'holiday',
      PAYSLIP: 'payslip',
      BRANCH_ALLOWANCE: 'branch/allowance',
      GENERATE_HOLIDAY: 'generate-holiday',
      ITEMS_EXPORT: 'payroll/export/items',
      TEMPLATE_SALARY: 'payroll/salary/template',
      CANCEL_CONFIRM: 'payroll/cancel-payslip'

    },
    EMPLOYEE: {
      EMPLOYEE: 'employee',
      DEGREE: 'degree',
      RELATIVE: 'relative',
      CONTRACT: 'contract',
      POSITION: 'position',
      BRANCH: 'branch',
      DEPARTMENT: 'department',
      EMPLOYEE_EXPORT: 'employee/export/employee',
      CATEGORY: 'category',
      SORT_STT: 'employee/sort/stt',
      HISTORY_SALARY: 'history/salary',
      RANK: 'rank',
      SETTING_RANK: 'setting-rank',
      SETTING_BONUS: 'setting-bonus',
    },
    TEMPLATE: {
      BASIC_TEMPLATE: 'permanent-template',
      OVERTIME_TEMPLATE: 'overtime-template'
    },
    SETTING_SALARY:'settings/salary',
    BLOCK_SETTING_SALARY:'settings/salary-block',
    EXPORT:'export',
    BRANCH_EXPORT: 'payroll/export/branch',
    POSITION_EXPORT: 'payroll/export/position',
    OVERVIEW: 'overview/hr'
  },
  SELL: {
    OVERVIEW: 'overview/sell',
    STATISTICAL: {
      STATISTICAL_AGENCY: 'overview/agency',
      STATISTICAL_PROVINCE: 'statistical/nation',
      STATISTICAL_CHICKEN: 'statistical/chicken',
      STATISTICAL_CUSTOMER: 'statistical/customer',
      STATISTICAL_AGENCY_PRINT: 'statistical/agency/export/print',
      STATISTICAL_PROVINCE_PRINT: 'statistical/nation/export/print',
      STATISTICAL_CHICKEN_PRINT: 'statistical/chicken/export/print',
      STATISTICAL_CUSTOMER_PRINT: 'statistical/customer/export/print'
    },
    CUSTOMER: {
      CUSTOMER: 'customer',
      CUSTOMER_EXPORT: 'customer/export/print',
      PAYMENT: 'payment-history'
    },
    ORDER: {
      ORDER: 'order',
      ORDER_HISTORY: 'order-history',
      ORDER_EXPORT: 'order/export/print'
    },
    ROUTE: {
      ROUTE: 'route',
      ROUTE_EXPORT: 'route/export/print'
    },
    COMMODITY: 'commodity',
    COMMODITY_TEMPLATE: 'commodity-template',
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
    WAREHOUSE: 'warehouse',
    PRODUCT: 'product',
    SUPPLIER: 'supplier',
    CONSIGNMENT: 'consignment',
    IOI_RECEIPT: 'ioi-receipt',
    STOCK:'stock',
    HISTORY: 'category-history'
  },
  BREED: {
    EGG_TYPE: 'egg-type',
    EGG: 'egg',
    INCUBATOR: 'incubator',
  },
  ADMIN: {
    HR: 'admin/hr'
  },
  LOGGER: 'logger',
  SLACK_WEBHOOK:
    'https://hooks.slack.com/services/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',
  AUTH: 'auth'
};
