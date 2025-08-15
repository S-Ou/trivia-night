import React, { ChangeEvent, FocusEvent } from "react";
import styled from "styled-components";
import {
  Button,
  Popover,
  Select,
  Switch,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { HexColorPicker } from "react-colorful";
import { Pipette } from "lucide-react";
import { isLightColor } from "@/utils/color";

const ConfigWrapper = styled.div`
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
  margin: 0 auto;
`;

const ConfigLabel = styled.h2`
  margin: 0;
  text-align: right;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ConfigInput = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
`;

const StyledTextField = styled(TextField.Root)<{ $error?: boolean }>`
  width: 100%;
  ${({ $error }) =>
    $error &&
    `
      box-shadow: inset 0 0 0 var(--text-field-border-width) red;
      --text-field-focus-color: red;
    `}
`;

const StyledTextArea = styled(TextArea)<{ $error?: boolean }>`
  width: 100%;
  ${({ $error }) =>
    $error &&
    `
      box-shadow: inset 0 0 0 var(--text-area-border-width) red;
      outline-color: red;
    `}
`;

const StyledSwitch = styled(Switch)``;

const StyledSelect = styled(Select.Root)``;

const StyledColorPickerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: 100%;
`;

const StyledColorPickerButton = styled(Button)`
  &:hover {
    opacity: 0.8;
  }
`;

export enum ConfigComponentType {
  Select,
  Switch,
  TextArea,
  TextField,
  ColorPicker,
}

export type ConfigField = {
  key: string;
  label: string;
  type: ConfigComponentType;
  value: string | boolean;
  required?: boolean;
  disabled?: boolean;
  options?: Record<string, string>;
  onChange: (value: string | boolean) => void;
  onBlur?: () => void;
};

export function ConfigComponent({
  label,
  type,
  value,
  required = false,
  disabled = false,
  options = {},
  onChange,
  onBlur,
}: ConfigField) {
  const error = required && !value && !disabled;
  return (
    <>
      <ConfigLabel>
        {label}
        {required && <span>*</span>}
      </ConfigLabel>
      <ConfigInput>
        {type === ConfigComponentType.TextField ? (
          <StyledTextField
            placeholder={label}
            value={value as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value)
            }
            onBlur={onBlur}
            disabled={disabled}
            $error={error}
          />
        ) : type === ConfigComponentType.TextArea ? (
          <StyledTextArea
            placeholder={label}
            value={value as string}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onChange(e.target.value)
            }
            onBlur={onBlur}
            disabled={disabled}
            $error={error}
          />
        ) : type === ConfigComponentType.Switch ? (
          <StyledSwitch
            checked={value as boolean}
            onCheckedChange={onChange}
            disabled={disabled}
          />
        ) : type === ConfigComponentType.Select ? (
          <StyledSelect
            value={value as string}
            disabled={disabled}
            onValueChange={onChange}
          >
            <Select.Trigger />
            <Select.Content>
              {Object.entries(options).map(([value, label]) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </StyledSelect>
        ) : type === ConfigComponentType.ColorPicker ? (
          <StyledColorPickerWrapper>
            <Popover.Root>
              <Popover.Trigger>
                <StyledColorPickerButton
                  variant="solid"
                  style={{
                    backgroundColor: value as string,
                  }}
                >
                  <Pipette
                    size={16}
                    color={
                      isLightColor(value as string) ? "#000000" : "#ffffff"
                    }
                  />
                </StyledColorPickerButton>
              </Popover.Trigger>
              <Popover.Content>
                <HexColorPicker
                  color={value as string}
                  onChange={(color) => onChange(color)}
                  onBlur={onBlur}
                />
              </Popover.Content>
            </Popover.Root>
            <StyledTextField
              placeholder={label}
              value={value as string}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
              onBlur={onBlur}
              disabled={disabled}
              $error={error}
              style={{
                fontFamily: "monospace",
              }}
            />
          </StyledColorPickerWrapper>
        ) : null}
      </ConfigInput>
    </>
  );
}

export function ConfigForm({ fields }: { fields: ConfigField[] }) {
  return (
    <ConfigWrapper>
      {fields.map((field) => {
        const { key, ...rest } = field;
        return <ConfigComponent key={key} {...rest} />;
      })}
    </ConfigWrapper>
  );
}
