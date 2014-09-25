{-# LANGUAGE OverloadedStrings #-}

import Data.String
import Data.Text (pack)
import Data.Maybe (mapMaybe)
import WaiAppStatic.Types (ssIndices, toPiece)
import Network.Wai.Application.Static (staticApp,defaultFileServerSettings)
import Network.Wai.Handler.Warp (runSettings, setPort, defaultSettings)
  
main :: IO ()
main = runSettings (setPort 3000 defaultSettings)
     $ staticApp
     $ (defaultFileServerSettings $ fromString ".") { ssIndices = mapMaybe (toPiece . pack) ["index.html"] }

-- vim:ts=4:sw=4:et:
