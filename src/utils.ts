import { useBreakpointValue, useChakraContext } from "@chakra-ui/react";
import type { CommonPropsAndClassName, GroupBase } from "react-select";
import type { Size, SizeProp } from "./types";

/**
 * Clean Common Props
 *
 * Borrowed from the original `react-select` package
 *
 * @see {@link https://github.com/JedWatson/react-select/blob/2f94e8d/packages/react-select/src/utils.ts#L79-L110}
 */
export const cleanCommonProps = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
  AdditionalProps,
>(
  props: Partial<CommonPropsAndClassName<Option, IsMulti, Group>> &
    AdditionalProps
): Omit<
  AdditionalProps,
  keyof CommonPropsAndClassName<Option, IsMulti, Group>
> => {
  const {
    className, // not listed in commonProps documentation, needs to be removed to allow Emotion to generate classNames
    clearValue,
    cx,
    getStyles,
    getClassNames,
    getValue,
    hasValue,
    isMulti,
    isRtl,
    options, // not listed in commonProps documentation
    selectOption,
    selectProps,
    setValue,
    theme, // not listed in commonProps documentation
    ...innerProps
  } = props;
  return { ...innerProps };
};

/** A type guard to ensure the default size on the Input component is valid. */
const isSize = (size: unknown): size is Size => {
  const isString = typeof size === "string";
  return isString && ["sm", "md", "lg"].includes(size);
};

const getDefaultSize = (size: unknown): Size => {
  if (isSize(size)) {
    return size;
  }

  if (size === "xs") {
    return "sm";
  }

  // This shouldn't be necessary but it might help the size get closer to the
  // user's goal if they have `xl` as a custom size.
  if (size === "xl") {
    return "lg";
  }

  return "md";
};

export const useSize = (size: SizeProp | undefined): Size => {
  const chakraContext = useChakraContext();
  const defaultSize = getDefaultSize(
    chakraContext.getSlotRecipe("select")?.defaultVariants?.size
  );

  // Ensure that the size used is one of the options, either `sm`, `md`, or `lg`
  // Or, if a breakpoint is passed, get the size based on the current screen size
  const responsiveSize = (typeof size === "string" ? [size] : size) ?? [
    defaultSize,
  ];

  return useBreakpointValue(responsiveSize) ?? defaultSize;
};
