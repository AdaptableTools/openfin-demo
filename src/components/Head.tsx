import NextHead from "next/head";

const Head = ({ title }: { title: string }) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </NextHead>
  );
};

export default Head;
