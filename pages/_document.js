import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Hubballi&display=swap"
            rel="stylesheet"
          />
          <link rel="shortcut icon" href="/logo.png" />
        </Head>
        <body>
          <script
            async
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`}
          ></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
