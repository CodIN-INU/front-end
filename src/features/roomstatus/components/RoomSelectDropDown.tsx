'use client';

import Select, {
  type StylesConfig,
  type DropdownIndicatorProps,
  components,
} from 'react-select';

export type RoomSelectOption = { value: string; label: string };

const roomSelectStyles: StylesConfig<RoomSelectOption, false> = {
  control: (provided) => ({
    ...provided,
    minHeight: 44,
    backgroundColor: 'white',
    border: 'none',
    paddingLeft: 11,
    paddingRight: 11,
    fontSize: 14,
    fontWeight: 500,
    color: '#111827',
    boxShadow: 'none',
    
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
    paddingLeft: 8,
    color: '#EBF0F7',
    zIndex:50
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    zIndex: 39,
  }),
  menuList: (provided) => ({ ...provided, padding: 0 }),
  option: (provided, state) => ({
    ...provided,
    fontSize: 14,
    fontWeight: 500,
    color: '#212121',
    backgroundColor: state.isFocused ? '#EBF0F7' : 'white',
    padding: '10px 12px',
    zIndex:50
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#212121',
  }),
};

function DropdownArrow() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.79999 0.800049L4.79999 4.80005L0.799988 0.800049"
        stroke="#BFBFBF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CustomDropdownIndicator(props: DropdownIndicatorProps<RoomSelectOption, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <DropdownArrow />
    </components.DropdownIndicator>
  );
}

interface RoomSelectProps {
  inputId: string;
  value: RoomSelectOption;
  options: readonly RoomSelectOption[];
  onChange: (value: string) => void;
}

export function RoomSelectDropDown({ inputId, value, options, onChange }: RoomSelectProps) {
  return (
    <Select<RoomSelectOption, false>
      inputId={inputId}
      value={value}
      options={[...options]}
      onChange={(opt) => onChange(opt?.value ?? value.value)}
      styles={roomSelectStyles}
      components={{ DropdownIndicator: CustomDropdownIndicator }}
      isSearchable={false}
    />
  );
}
