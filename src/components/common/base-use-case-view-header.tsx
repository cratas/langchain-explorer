import { Button, Chip, Tooltip, Typography } from '@material-tailwind/react';

type Props = {
  chipItems: string[];
  title: string;
  description: string;
  buttonText: string;
  buttonLinkURL: string;
  settingsItems: {
    label: string;
    value: string;
    tooltipContent: string;
  }[];
};

export const BaseUseCaseViewHeader = ({
  chipItems,
  title,
  description,
  buttonText,
  settingsItems,
  buttonLinkURL,
}: Props) => (
  <div
    className="mb-5 mt-7 flex flex-col gap-10 rounded-lg bg-gradient-to-br from-lighter-purple via-transparent
      via-30%
      to-transparent p-[1px] backdrop:blur-3xl"
  >
    <div
      className="flex flex-col gap-8 rounded-lg
        bg-gradient-to-br 
      from-background-light
      via-background-dark
        via-30%
      to-black/60 p-4"
    >
      <div className="flex flex-wrap gap-2">{chipItems.map((item) => renderChip(item))}</div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex w-full flex-col gap-2 lg:w-[45%]">
          <Typography placeholder="" variant="h5" className="text-text-light">
            {title}
          </Typography>

          <Typography placeholder="" className="text-sm text-text-primary">
            {description}
          </Typography>

          <div>
            <a href={buttonLinkURL}>
              <Button
                placeholder=""
                size="sm"
                className="mt-5 w-auto rounded bg-lighter-purple hover:bg-light-purple"
              >
                {buttonText}
              </Button>
            </a>
          </div>
        </div>

        <div className="flex w-full items-center justify-center lg:w-[55%]">
          <div className="flex w-full flex-wrap items-start gap-5">
            {settingsItems.map(({ label, value, tooltipContent }) =>
              renderItem(label, value, tooltipContent)
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const renderItem = (label: string, value: string, tooltipContent: string) => (
  <div
    key={value}
    className="flex min-w-[10rem] grow gap-2 rounded-lg border border-gray-900 bg-background-dark p-1 pr-2"
  >
    <Tooltip
      className="bg-white text-background-dark"
      content={tooltipContent}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
    >
      <div className="flex cursor-pointer items-center justify-center rounded-md bg-background-light px-2">
        <span className="icon-[fluent--info-24-filled] text-2xl text-lighter-purple" />
      </div>
    </Tooltip>

    <div className="flex flex-col items-start justify-between overflow-hidden">
      <Typography placeholder="" className="truncate text-ellipsis text-sm text-text-primary">
        {label}
      </Typography>
      <Typography placeholder="" className="truncate  text-sm font-bold text-text-light">
        {value}
      </Typography>
    </div>
  </div>
);

const renderChip = (label: string) => (
  <Chip
    key={label}
    value={label}
    size="sm"
    className="inline-block border border-lighter-purple normal-case text-text-light"
    variant="outlined"
  />
);
