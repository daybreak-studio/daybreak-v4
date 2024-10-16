import GridLayout from "react-grid-layout";
import { useBreakpoint, WidgetGridContext } from "@/components/grid/hooks";
import { Defaults, GridProps } from "@/components/grid/props";
import clsx from "clsx";
import { useScramble } from "use-scramble";

// GridOverlay component
interface GridOverlayProps {
  cols: number;
  rowHeight: number;
  width: number;
  height: number;
  margin: [number, number];
}

const GridOverlay: React.FC<GridOverlayProps> = ({
  cols,
  rowHeight,
  width,
  height,
  margin,
}) => {
  const [marginX, marginY] = margin;
  const cellWidth = (width - (cols - 1) * marginX) / cols;
  const rows = Math.floor((height + marginY) / (rowHeight + marginY));

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="relative h-full w-full">
        {Array.from({ length: cols * rows }).map((_, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const left = col * (cellWidth + marginX);
          const top = row * (rowHeight + marginY);

          return (
            <div
              key={index}
              className="absolute z-20 flex items-center justify-center border border-blue-300 bg-blue-100 bg-opacity-20 text-xs font-bold text-blue-600 opacity-25"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${cellWidth}px`,
                height: `${rowHeight}px`,
              }}
            >
              {col},{row}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const WidgetGridProvider: React.FC<GridProps.Provider> = ({
  size,
  id,
  position,
  children,
  breakpoint,
}) => {
  return (
    <WidgetGridContext.Provider value={{ size, id, position, breakpoint }}>
      {children}
    </WidgetGridContext.Provider>
  );
};

export const WidgetGrid: React.FC<GridProps.Layout> = ({
  header,
  heading,
  layout,
  debug,
}) => {
  const breakpoints: GridProps.Settings = {
    // Proportional to Figma design, but rowHeight can be used as a scaling factor for the entire widget grid to get larger or smaller based on viewport size.
    xl: { rowHeight: 180, margin: [32, 32] },
    lg: { rowHeight: 160, margin: [16, 16] },
    md: { rowHeight: 120, margin: [22, 22] },
    sm: { rowHeight: 110, margin: [19, 19] },
  };
  const breakpoint = useBreakpoint() as keyof typeof breakpoints;
  const settings = breakpoints[breakpoint];
  const cols = Math.max(
    ...layout.map((item) => item.position.x + item.size.w),
    0,
  );
  const width = cols * settings.rowHeight + (cols - 1) * settings.margin[0];

  const Structure: GridProps.Structure = {
    cols,
    width,
    rowHeight: settings.rowHeight,
    margin: settings.margin,
    ...Defaults.Structure,
  };

  const gridHeight =
    Math.max(...layout.map((item) => item.position.y + item.size.h)) *
      (settings.rowHeight + settings.margin[1]) -
    settings.margin[1];

  const { ref, replay } = useScramble({
    text: heading,
    speed: 1,
    playOnMount: false,
  });

  return (
    <div className="relative h-screen w-screen transition-all">
      <div className="flex h-full w-full flex-col items-center justify-center gap-12">
        {header ? (
          header
        ) : (
          <h1
            ref={ref}
            onMouseOver={replay}
            onFocus={replay}
            className="line-clamp-2 h-24 w-72 text-center text-4xl text-zinc-400 xl:w-80"
          ></h1>
        )}
        <div
          style={{ width: `${width}px`, height: `${gridHeight}px` }}
          className="relative"
        >
          {debug && (
            <GridOverlay
              cols={cols}
              rowHeight={settings.rowHeight}
              width={width}
              height={gridHeight}
              margin={settings.margin}
            />
          )}
          <GridLayout {...Structure} cols={Structure.cols}>
            {layout.map((item) => (
              <div
                key={item.id}
                data-grid={{
                  i: item.id,
                  x: item.position.x,
                  y: item.position.y,
                  w: item.size.w,
                  h: item.size.h,
                  ...Defaults.DataGridAttributes,
                }}
                className="h-full w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] xl:rounded-3xl"
              >
                <div
                  className={clsx({
                    ["border-[1px] border-red-500"]: debug,
                    ["flex h-full w-full overflow-hidden"]: true,
                  })}
                >
                  <WidgetGridProvider
                    id={item.id}
                    size={item.size}
                    position={item.position}
                    breakpoint={breakpoint}
                  >
                    {item.content}
                  </WidgetGridProvider>
                  {debug && (
                    <div className="absolute left-0 top-0 bg-gray-700 bg-opacity-50 p-1 text-xs uppercase text-white">
                      ID: {item.id}
                      <br />
                      {item.size.w}x{item.size.h} — ({item.position.x},
                      {item.position.y})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </GridLayout>
        </div>
      </div>
    </div>
  );
};
