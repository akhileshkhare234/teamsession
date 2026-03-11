/// <reference types="react-scripts" />
declare module "emoji-picker-react" {
  import * as React from "react";

  interface EmojiClickData {
    emoji: string;
  }

  interface EmojiPickerProps {
    onEmojiClick: (event: MouseEvent, data: EmojiClickData) => void;
  }

  const EmojiPicker: React.FC<EmojiPickerProps>;

  export default EmojiPicker;
}
