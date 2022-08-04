import { Helmet } from 'react-helmet-async';

interface NotFoundErrorProps {
  title: string;
  body?: React.ReactNode;
}

export const NotFoundError = ({ title, body }: NotFoundErrorProps) => {
  const titleText = `404 | ${title}`;

  return (
    <>
      <Helmet>
        <title>{titleText}</title>
      </Helmet>
      <div className={`h-[calc(100vh-100px)] flex justify-center items-center`}>
        <h1 className={`text-[24px] font-medium pr-6 mb-0`}>404</h1>
        <span className={`border-r op-[0.3] mr-5 h-10 mb-0`}></span>
        <h2 className={`text-[14px] font-normal mb-0`}>{body ?? title}</h2>
      </div>
    </>
  );
};
