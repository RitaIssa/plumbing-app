"use client";

type Props = {
  website: string;
  name: string;
  size?: number;
  className?: string;
};

export default function FaviconImage({ website, name, size = 64, className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${website}&sz=${size}`}
      alt={`${name} logo`}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
