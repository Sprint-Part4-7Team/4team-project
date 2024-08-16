"use client";

import useClickOutside from "@/hooks/use-click-outside";
import {
  ButtonHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

interface DropdownState {
  isDropdownOpen: boolean;
  handleDropdown: () => void;
  selected: string;
  handleSelect: (value: string) => void;
}

// NOTE - 컨텍스트 생성
const DropdownState = createContext<DropdownState | undefined>(undefined);

export function useDropdown() {
  const dropdownState = useContext(DropdownState);

  if (!dropdownState) {
    throw new Error("드롭다운 컴포넌트 안에서 사용되어야 합니다");
  }
  return dropdownState;
}

interface DropdownProps {
  children: ReactNode;
  selected: string;
  setSelected: (value: string) => void;
}

/**
 * @author 김서영
 * @param children : 드롭다운과 관련된 컴포넌트들이 해당됩니다.
 * @param defaultSelected : 기본적으로 드롭다운 버튼에 보일 내용입니다.
 * @example    <Dropdown defaultSelected="항목을 선택하세요">...</Dropdown>
 **/
export function Dropdown({ children, selected, setSelected }: DropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleSelect = (value: string) => setSelected(value);
  const handleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // NOTE - 드롭다운이 열려있는 경우 외부 영역 클릭하면 닫히도록 하는 함수
  const dropdownRef = useClickOutside<HTMLDivElement>((event) => {
    setIsDropdownOpen(false);
  });

  return (
    <DropdownState.Provider
      value={{
        isDropdownOpen,
        handleDropdown,
        selected,
        handleSelect,
      }}
    >
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </DropdownState.Provider>
  );
}

Dropdown.Button = Button;
Dropdown.Body = Body;
Dropdown.Item = Item;
Dropdown.CloseItem = CloseItem;

// NOTE - Button

interface DropdownButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

/**
 * @author : 김서영
 * 드롭다운에서 Select field 영역입니다.
 * Select field는 드롭다운 리스트에서 선택한 항목을 필드에 표시하는 영역입니다.
 * 클릭 시 드롭다운 리스트가 열립니다.
 * 항목을 선택하는 경우 선택한 항목이 필드에 표시됩니다.
 * @param children : 선택 항목과 관련 없는 토글 아이콘 등이 사용됩니다
 * @returns : 버튼 컴포넌트를 반환합니다.
 * @example : <Dropdown.Button>▽</Dropdown.Button>
 **/
function Button({ children, className, ...rest }: DropdownButtonProps) {
  const { handleDropdown, selected } = useDropdown();
  return (
    <button
      onClick={handleDropdown}
      className={`${className} flex w-full items-center`}
      {...rest}
    >
      {selected}
      {children}
    </button>
  );
}

// NOTE - Body
interface BodyProps extends OlHTMLAttributes<HTMLUListElement> {
  children: ReactNode;
  className?: string;
}

/**
 * @author 김서영
 * 클릭 시에 나타나는 드롭다운 리스트를 감싸는 부분입니다
 * @param children : Item들이 children에 해당됩니다.
 * @param className : 너비 및 배경색 등 추가적으로 적용될 스타일을 지정해주는 프롭입니다.
 * @example  <Dropdown.Body className="w-36 bg-blue-200">...</Dropdown.Body>
 **/
function Body({ children, className, ...rest }: BodyProps) {
  const { isDropdownOpen } = useDropdown();

  return isDropdownOpen ? (
    <ul className={`${className} absolute z-50`} {...rest}>
      {children}
    </ul>
  ) : null;
}

// NOTE - Item
interface ItemProps extends OlHTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  value: string;
}

/**
 * @author 김서영
 * 드롭다운 선택 항목에 대한 컴포넌트입니다.
 * @param children : li 안에 포함될 내용을 적습니다
 * @param className : 너비 및 배경색 등 추가적으로 적용될 스타일을 지정해주는 프롭입니다.
 * @example  <Dropdown.Item   value={`${membership.group.name} 팀`}><div className="flex gap-2"><p>Seo</p><span>Young</span></div></Dropdown.Item>
 **/
function Item({ children, value, ...rest }: ItemProps) {
  const { handleSelect, handleDropdown } = useDropdown();

  const onSelect = () => {
    handleSelect(value);
    handleDropdown();
  };
  return (
    <li className="cursor-pointer" onClick={onSelect} {...rest}>
      {children}
    </li>
  );
}

// NOTE - CloseItem
/**
 * @author 김서영
 * 드롭다운을 닫기만 하는 컴포넌트입니다.
 * @param children : li 안에 포함될 내용을 적습니다.
 * @param className : 너비 및 배경색 등 추가적으로 적용될 스타일을 지정해주는 프롭입니다.
 * @example  <Dropdown.CloseItem>닫기</Dropdown.CloseItem>
 **/
function CloseItem({ children, ...rest }: OlHTMLAttributes<HTMLLIElement>) {
  const { handleDropdown } = useDropdown();

  const onClose = () => {
    handleDropdown();
  };

  return (
    <li className="cursor-pointer" onClick={onClose} {...rest}>
      {children}
    </li>
  );
}
