import {
  DEPARTMENT_LABELS,
  type DepartmentCode,
} from '@/constants/college';

/**
 * 학과 코드(예: COMPUTER_SCI)를 표시명(예: 컴퓨터공학부)으로 변환한다.
 * 알 수 없는 코드는 그대로 반환한다.
 */
export function getDepartmentLabel(code: DepartmentCode | string): string {
  if (Object.prototype.hasOwnProperty.call(DEPARTMENT_LABELS, code)) {
    return DEPARTMENT_LABELS[code as DepartmentCode];
  }
  return code;
}
