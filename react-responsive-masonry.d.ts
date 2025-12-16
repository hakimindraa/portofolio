declare module 'react-responsive-masonry' {
  import { ReactNode } from 'react';

  export interface MasonryProps {
    columnsCountBreakPoints?: { [key: number]: number };
    gutter?: string;
    children?: ReactNode;
  }

  export default function Masonry(props: MasonryProps): JSX.Element;
}
