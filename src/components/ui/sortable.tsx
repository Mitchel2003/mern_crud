import {
  type DragEndEvent,
  type DropAnimation,
  type Announcements,
  type DndContextProps,
  type UniqueIdentifier,
  type ScreenReaderInstructions,
  type DraggableSyntheticListeners,
  useSensor,
  DndContext,
  useSensors,
  TouchSensor,
  MouseSensor,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  closestCorners,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
  restrictToHorizontalAxis,
} from "@dnd-kit/modifiers";
import {
  type SortableContextProps,
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot, type SlotProps } from "@radix-ui/react-slot";

import { composeEventHandlers, useComposedRefs } from "@/lib/composition";
import * as ReactDOM from "react-dom";
import { cn } from "@/lib/utils";
import * as React from "react";

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
    collisionDetection: closestCorners,
  },
};

const ROOT_NAME = "Sortable";
const ITEM_NAME = "SortableItem";
const CONTENT_NAME = "SortableContent";
const OVERLAY_NAME = "SortableOverlay";
const ITEM_HANDLE_NAME = "SortableItemHandle";

const SORTABLE_ERROR = {
  [ROOT_NAME]: `\`${ROOT_NAME}\` components must be within \`${ROOT_NAME}\``,
  [CONTENT_NAME]: `\`${CONTENT_NAME}\` must be within \`${ROOT_NAME}\``,
  [ITEM_NAME]: `\`${ITEM_NAME}\` must be within \`${CONTENT_NAME}\``,
  [ITEM_HANDLE_NAME]: `\`${ITEM_HANDLE_NAME}\` must be within \`${ITEM_NAME}\``,
  [OVERLAY_NAME]: `\`${OVERLAY_NAME}\` must be within \`${ROOT_NAME}\``,
} as const;

interface SortableRootContextValue<T> {
  id: string;
  items: T[];
  flatCursor: boolean;
  activeId: UniqueIdentifier | null;
  modifiers: DndContextProps["modifiers"];
  strategy: SortableContextProps["strategy"];
  getItemValue: (item: T) => UniqueIdentifier;
  setActiveId: (id: UniqueIdentifier | null) => void;
}

const SortableRootContext = React.createContext<SortableRootContextValue<unknown> | null>(null);
SortableRootContext.displayName = ROOT_NAME;

function useSortableContext(name: keyof typeof SORTABLE_ERROR) {
  const context = React.useContext(SortableRootContext)
  if (!context) throw new Error(SORTABLE_ERROR[name])
  return context
}

interface GetItemValue<T> {
  /**
   * Callback that returns a unique identifier for each sortable item. Required for array of objects.
   * @example getItemValue={(item) => item.id}
   */
  getItemValue: (item: T) => UniqueIdentifier
}

type SortableProps<T> = DndContextProps & {
  value: T[];
  flatCursor?: boolean;
  onValueChange?: (items: T[]) => void;
  strategy?: SortableContextProps["strategy"];
  orientation?: "vertical" | "horizontal" | "mixed";
  onMove?: (event: DragEndEvent & { activeIndex: number; overIndex: number }) => void;
} & (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>)

function Sortable<T>(props: SortableProps<T>) {
  const {
    getItemValue: getItemValueProp,
    onValueChange,
    strategy,
    onMove,
    //data_attributes
    orientation = "vertical",
    id = React.useId(),
    flatCursor = false,
    accessibility,
    modifiers,
    value,
    ...sortableProps
  } = props;
  const sensors = useSensors(
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  )
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const config = React.useMemo(() => orientationConfig[orientation], [orientation])

  const getItemValue = React.useCallback((item: T): UniqueIdentifier => {
    if (typeof item === "object" && !getItemValueProp) {
      throw new Error("getItemValue is required when using array of objects.")
    }
    return getItemValueProp
      ? getItemValueProp(item)
      : (item as UniqueIdentifier)
  }, [getItemValueProp])

  const onDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      const activeIndex = value.findIndex((item) => getItemValue(item) === active.id)
      const overIndex = value.findIndex((item) => getItemValue(item) === over.id)

      if (onMove) { onMove({ ...event, activeIndex, overIndex }) }
      else { onValueChange?.(arrayMove(value, activeIndex, overIndex)) }
    }
    setActiveId(null)
  }, [value, onValueChange, onMove, getItemValue])

  const announcements: Announcements = {
    onDragStart({ active }) {
      const activeValue = active.id.toString();
      return `Grabbed sortable item "${activeValue}". Current position is ${active.data.current?.sortable.index + 1} of ${value.length}. Use arrow keys to move, space to drop.`;
    },
    onDragOver({ active, over }) {
      if (over) {
        const activeValue = active.id.toString();
        const overIndex = over.data.current?.sortable.index ?? 0;
        const activeIndex = active.data.current?.sortable.index ?? 0;
        const moveDirection = overIndex > activeIndex ? "down" : "up";
        return `Sortable item "${activeValue}" moved ${moveDirection} to position ${overIndex + 1} of ${value.length}.`;
      }
      return "Sortable item is no longer over a droppable area. Press escape to cancel.";
    },
    onDragEnd({ active, over }) {
      const activeValue = active.id.toString();
      if (over) {
        const overIndex = over.data.current?.sortable.index ?? 0;
        return `Sortable item "${activeValue}" dropped at position ${overIndex + 1} of ${value.length}.`;
      }
      return `Sortable item "${activeValue}" dropped. No changes were made.`;
    },
    onDragCancel({ active }) {
      const activeIndex = active.data.current?.sortable.index ?? 0;
      const activeValue = active.id.toString();
      return `Sorting cancelled. Sortable item "${activeValue}" returned to position ${activeIndex + 1} of ${value.length}.`;
    },
    onDragMove({ active, over }) {
      if (over) {
        const overIndex = over.data.current?.sortable.index ?? 0;
        const activeIndex = active.data.current?.sortable.index ?? 0;
        const moveDirection = overIndex > activeIndex ? "down" : "up";
        const activeValue = active.id.toString();
        return `Sortable item "${activeValue}" is moving ${moveDirection} to position ${overIndex + 1} of ${value.length}.`;
      }
      return "Sortable item is no longer over a droppable area. Press escape to cancel.";
    }
  }

  const screenReaderInstructions: ScreenReaderInstructions = React.useMemo(() => ({
    draggable: `
        To pick up a sortable item, press space or enter.
        While dragging, use the ${orientation === "vertical" ? "up and down" : orientation === "horizontal" ? "left and right" : "arrow"} keys to move the item.
        Press space or enter again to drop the item in its new position, or press escape to cancel.
      `,
  }), [orientation])

  const contextValue = React.useMemo(
    () => ({
      id,
      activeId,
      flatCursor,
      setActiveId,
      getItemValue,
      items: value,
      strategy: strategy ?? config.strategy,
      modifiers: modifiers ?? config.modifiers,
    }),
    [id, value, activeId, strategy, modifiers, flatCursor, getItemValue, config.strategy, config.modifiers]
  )

  return (
    <SortableRootContext.Provider value={contextValue as SortableRootContextValue<unknown>}>
      <DndContext
        id={id}
        sensors={sensors}
        modifiers={modifiers ?? config.modifiers}
        collisionDetection={config.collisionDetection}
        onDragEnd={composeEventHandlers(sortableProps.onDragEnd, onDragEnd)}
        onDragCancel={composeEventHandlers(sortableProps.onDragCancel, () => setActiveId(null))}
        onDragStart={composeEventHandlers(sortableProps.onDragStart, ({ active }) => setActiveId(active.id))}
        accessibility={{ announcements, screenReaderInstructions, ...accessibility }}
        {...sortableProps}
      />
    </SortableRootContext.Provider>
  );
}

const SortableContentContext = React.createContext<boolean>(false);
SortableContentContext.displayName = CONTENT_NAME;

interface SortableContentProps extends SlotProps {
  strategy?: SortableContextProps["strategy"];
  children: React.ReactNode;
  asChild?: boolean;
}

const SortableContent = React.forwardRef<HTMLDivElement, SortableContentProps>(
  (props, forwardedRef) => {
    const { strategy: strategyProp, asChild, ...contentProps } = props;
    const context = useSortableContext(CONTENT_NAME);

    const items = React.useMemo(() => {
      return context.items.map((item) => context.getItemValue(item));
    }, [context.items, context.getItemValue]);

    const ContentSlot = asChild ? Slot : "div";

    return (
      <SortableContentContext.Provider value={true}>
        <SortableContext
          items={items}
          strategy={strategyProp ?? context.strategy}
        >
          <ContentSlot {...contentProps} ref={forwardedRef} />
        </SortableContext>
      </SortableContentContext.Provider>
    );
  },
);
SortableContent.displayName = CONTENT_NAME;

interface SortableItemContextValue {
  id: string;
  attributes: React.HTMLAttributes<HTMLElement>;
  listeners: DraggableSyntheticListeners | undefined;
  setActivatorNodeRef: (node: HTMLElement | null) => void;
  isDragging?: boolean;
  disabled?: boolean;
}

const SortableItemContext = React.createContext<SortableItemContextValue>({
  id: "",
  attributes: {},
  listeners: undefined,
  setActivatorNodeRef: () => { },
  isDragging: false,
});
SortableItemContext.displayName = ITEM_NAME;

interface SortableItemProps extends SlotProps {
  value: UniqueIdentifier;
  asHandle?: boolean;
  asChild?: boolean;
  disabled?: boolean;
}

const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
  (props, forwardedRef) => {
    const {
      value,
      style,
      asHandle,
      asChild,
      disabled,
      className,
      ...itemProps
    } = props;
    const inSortableContent = React.useContext(SortableContentContext);
    const inSortableOverlay = React.useContext(SortableOverlayContext);

    if (!inSortableContent && !inSortableOverlay) {
      throw new Error(SORTABLE_ERROR[ITEM_NAME]);
    }

    if (value === "") {
      throw new Error(`${ITEM_NAME} value cannot be an empty string.`);
    }

    const context = useSortableContext(ITEM_NAME);
    const id = React.useId();
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: value, disabled });

    const composedRef = useComposedRefs(forwardedRef, (node) => {
      if (disabled) return;
      setNodeRef(node);
      if (asHandle) setActivatorNodeRef(node);
    });

    const composedStyle = React.useMemo<React.CSSProperties>(() => {
      return {
        transform: CSS.Translate.toString(transform),
        transition,
        ...style,
      };
    }, [transform, transition, style]);

    const itemContext = React.useMemo<SortableItemContextValue>(
      () => ({
        id,
        attributes,
        listeners,
        setActivatorNodeRef,
        isDragging,
        disabled,
      }),
      [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled],
    );

    const ItemSlot = asChild ? Slot : "div";

    return (
      <SortableItemContext.Provider value={itemContext}>
        <ItemSlot
          id={id}
          data-dragging={isDragging ? "" : undefined}
          {...itemProps}
          {...(asHandle ? attributes : {})}
          {...(asHandle ? listeners : {})}
          tabIndex={disabled ? undefined : 0}
          ref={composedRef}
          style={composedStyle}
          className={cn(
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
            {
              "touch-none select-none": asHandle,
              "cursor-default": context.flatCursor,
              "data-[dragging]:cursor-grabbing": !context.flatCursor,
              "cursor-grab": !isDragging && asHandle && !context.flatCursor,
              "opacity-50": isDragging,
              "pointer-events-none opacity-50": disabled,
            },
            className,
          )}
        />
      </SortableItemContext.Provider>
    );
  },
);
SortableItem.displayName = ITEM_NAME;

interface SortableItemHandleProps
  extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

const SortableItemHandle = React.forwardRef<
  HTMLButtonElement,
  SortableItemHandleProps
>((props, forwardedRef) => {
  const { asChild, disabled, className, ...itemHandleProps } = props;
  const itemContext = React.useContext(SortableItemContext);
  if (!itemContext) {
    throw new Error(SORTABLE_ERROR[ITEM_HANDLE_NAME]);
  }
  const context = useSortableContext(ITEM_HANDLE_NAME);

  const isDisabled = disabled ?? itemContext.disabled;

  const composedRef = useComposedRefs(forwardedRef, (node) => {
    if (!isDisabled) return;
    itemContext.setActivatorNodeRef(node);
  });

  const HandleSlot = asChild ? Slot : "button";

  return (
    <HandleSlot
      aria-controls={itemContext.id}
      aria-roledescription="sortable item handle"
      data-dragging={itemContext.isDragging ? "" : undefined}
      {...itemHandleProps}
      {...itemContext.attributes}
      {...itemContext.listeners}
      ref={composedRef}
      className={cn(
        "select-none disabled:pointer-events-none disabled:opacity-50",
        context.flatCursor
          ? "cursor-default"
          : "cursor-grab data-[dragging]:cursor-grabbing",
        className,
      )}
      disabled={isDisabled}
    />
  );
});
SortableItemHandle.displayName = ITEM_HANDLE_NAME;

const SortableOverlayContext = React.createContext(false);
SortableOverlayContext.displayName = OVERLAY_NAME;

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

interface SortableOverlayProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DragOverlay>, "children"> {
  container?: HTMLElement | DocumentFragment | null;
  children?:
  | ((params: { value: UniqueIdentifier }) => React.ReactNode)
  | React.ReactNode;
}

function SortableOverlay(props: SortableOverlayProps) {
  const { container: containerProp, children, ...overlayProps } = props;
  const context = useSortableContext(OVERLAY_NAME);

  const [mounted, setMounted] = React.useState(false);
  React.useLayoutEffect(() => setMounted(true), []);

  const container =
    containerProp ?? (mounted ? globalThis.document?.body : null);

  if (!container) return null;

  return ReactDOM.createPortal(
    <DragOverlay
      modifiers={context.modifiers}
      dropAnimation={dropAnimation}
      className={cn(!context.flatCursor && "cursor-grabbing")}
      {...overlayProps}
    >
      <SortableOverlayContext.Provider value={true}>
        {context.activeId
          ? typeof children === "function"
            ? children({ value: context.activeId })
            : children
          : null}
      </SortableOverlayContext.Provider>
    </DragOverlay>,
    container,
  );
}

const Root = Sortable;
const Content = SortableContent;
const Item = SortableItem;
const ItemHandle = SortableItemHandle;
const Overlay = SortableOverlay;

export {
  Sortable,
  SortableItem,
  SortableContent,
  SortableItemHandle,
  SortableOverlay,
  //
  Root,
  Content,
  Item,
  ItemHandle,
  Overlay,
}