import {RequireOnlyOne} from "../../../../shared/types";

interface resultModalSalary {
  title?: string,
  salaryId?: number
}

export type resultModalSalaryData = RequireOnlyOne<resultModalSalary, 'title' | 'salaryId'>
