interface Generate {
  createdAt: Date,
  employeeId?: number;
}

export interface AddPayrollDto {
  body: Generate;
  inHistory?: boolean
}

