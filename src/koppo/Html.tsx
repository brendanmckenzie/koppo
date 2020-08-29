import * as React from "react";
import { Helmet } from "react-helmet";

export const Html: React.FC<{ body: string }> = ({ body }) => {
  const helmet = Helmet.renderStatic();
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();

  return (
    <html {...htmlAttrs}>
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
      </head>
      <body {...bodyAttrs} dangerouslySetInnerHTML={{ __html: body }} />
    </html>
  );
};
