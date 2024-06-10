import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

const CustomErrorComponent = (props) => {
  return <Error statusCode={props.statusCode} />;
};

export const getStaticProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return {
    props: {
      statusCode: JSON.stringify(
        contextData ?? contextData.res ?? contextData.res.statusCode,
      ),
    },
  };
};

export default CustomErrorComponent;
