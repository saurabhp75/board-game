import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

import React from "react";

function SocialShare() {
  return (
    <div className="mb-2, mt-2 flex">
      <div>
        <FacebookShareButton url={"https://calm-praline-8ccca9.netlify.app/"}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </div>
      <div>
        <TwitterShareButton
          title={"test"}
          url={"https://calm-praline-8ccca9.netlify.app/"}
          hashtags={["hashtag1", "hashtag2"]}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </div>
      <div>
        <LinkedinShareButton url={"https://calm-praline-8ccca9.netlify.app/"}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
      <div>
        <WhatsappShareButton url={"https://calm-praline-8ccca9.netlify.app/"}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
      <div>
        <TelegramShareButton url={"https://calm-praline-8ccca9.netlify.app/"}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </div>
      <div>
        <RedditShareButton url={"https://calm-praline-8ccca9.netlify.app/"}>
          <RedditIcon size={32} round />
        </RedditShareButton>
      </div>
      <div>
        <PinterestShareButton url={"https://calm-praline-8ccca9.netlify.app/"}>
          <PinterestIcon size={32} round />
        </PinterestShareButton>
      </div>
    </div>
  );
}

export default SocialShare;
