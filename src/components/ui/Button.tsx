import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-pill)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-aqua-400 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // bright amber — RESERVED for primary conversion CTAs
        amber: "bg-amber-500 text-[#20160a] shadow-[var(--shadow-amber)] hover:shadow-[0_12px_34px_rgba(245,166,35,0.42)] hover:-translate-y-0.5",
        teal: "bg-teal-600 text-white hover:bg-teal-500 hover:-translate-y-0.5 shadow-[var(--shadow-card)]",
        outline: "border border-teal-600/45 text-teal-700 hover:border-teal-600 hover:bg-teal-600/8",
        "outline-light": "border border-aqua-400/45 text-aqua-300 hover:border-aqua-400 hover:bg-aqua-400/10",
        navy: "bg-navy-800 text-white hover:bg-navy-700 hover:-translate-y-0.5",
        ghost: "text-navy-800 hover:bg-navy-800/6",
      },
      size: {
        sm: "text-sm px-4 py-2",
        md: "text-[15px] px-6 py-3",
        lg: "text-base px-7 py-3.5",
      },
    },
    defaultVariants: { variant: "teal", size: "md" },
  }
);

type BaseProps = VariantProps<typeof button> & { className?: string; children: React.ReactNode };

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined };
type ButtonAsLink = BaseProps & { to: string };
type ButtonAsAnchor = BaseProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  const { variant, size, className, children } = props;
  const classes = cn(button({ variant, size }), className);

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }
  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
