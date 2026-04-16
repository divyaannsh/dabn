import React, { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  Info, 
  Zap, 
  Maximize2, 
  ArrowRightLeft, 
  ShieldCheck, 
  Award,
  Filter,
  CheckCircle2,
  AlertCircle,
  Brain,
  Layers,
  Check,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Embedded Data from Excel Sheet ---
const COMPRESSOR_DATA = {
  "H series": [
    { "danfoss": { "model": "HRP025", "tr": 2, "w": "7,034", "btu": "24,000", "dimensions": "165 × 165 × 413", "code": "121L3086" }, "copeland": { "model": "ZR25K-PFV", "tr": 2.1, "w": "7,400", "btu": "25,200", "dimensions": "241×241×403" } },
    { "danfoss": { "model": "HRP032", "tr": 2.5, "w": "8,793", "btu": "30,000", "dimensions": "181 × 181 × 430", "code": "121L3345" }, "copeland": { "model": "ZR28K / ZR32K", "tr": "2.3–2.7", "w": "8,200-9,300", "btu": "28,000-32,000", "dimensions": "242×242×410" } },
    { "danfoss": { "model": "HRP038", "tr": 3, "w": "10,551", "btu": "36,000", "dimensions": "181 × 181 × 430", "code": "121L3353" }, "copeland": { "model": "ZR34K / ZR36K", "tr": "2.8–3.0", "w": "9,900-10,500", "btu": "34,000-36,000", "dimensions": "242×242×410" } },
    { "danfoss": { "model": "HRP042T1LP6", "tr": 3.5, "w": "12,310", "btu": "42,000", "dimensions": "185 × 185 × 440", "code": "121L3094" }, "copeland": { "model": "ZR40K / ZR42K", "tr": "3.3–3.5", "w": "11,700-12,300", "btu": "40,000-42,000", "dimensions": "246×246×420" } },
    { "danfoss": { "model": "HRP047U1LP6", "tr": 4, "w": "14,068", "btu": "48,000", "dimensions": "185 × 185 × 450", "code": "121L3347" }, "copeland": { "model": "ZR47K-PFV", "tr": 4, "w": "14,000", "btu": "47,000", "dimensions": "246×246×430" } },
    { "danfoss": { "model": "HRM054U1LP6", "tr": 4.5, "w": "15,827", "btu": "54,000", "dimensions": "185 × 185 × 460", "code": "121L3349" }, "copeland": { "model": "ZR54K-TF5", "tr": 4.5, "w": "15,800", "btu": "54,000", "dimensions": "246×246×440" } },
    { "danfoss": { "model": "HRP060T1LP6", "tr": 5, "w": "17,585", "btu": "60,000", "dimensions": "185 × 185 × 460", "code": "121L3070" }, "copeland": { "model": "ZR57K / ZR61K", "tr": "4.8–5.1", "w": "16,700-17,900", "btu": "57,000-61,000", "dimensions": "246×246×440" } },
    { "danfoss": { "model": "HRP042U2LP6", "tr": 3.5, "w": "12,310", "btu": "42,000", "dimensions": "185 × 185 × 440", "code": "121L1106" }, "copeland": { "model": "ZR42K-TF5", "tr": 3.5, "w": "12,300", "btu": "42,000", "dimensions": "246×246×420" } },
    { "danfoss": { "model": "HRP047T2LP6", "tr": 4, "w": "14,068", "btu": "48,000", "dimensions": "185 × 185 × 450", "code": "121L1126" }, "copeland": { "model": "ZR47K-TF5", "tr": 4, "w": "14,000", "btu": "47,000", "dimensions": "246×246×430" } },
    { "danfoss": { "model": "HRP054U2LP6", "tr": 4.5, "w": "15,827", "btu": "54,000", "dimensions": "185 × 185 × 460", "code": "121L3351" }, "copeland": { "model": "ZR54K-TF5", "tr": 4.5, "w": "15,800", "btu": "54,000", "dimensions": "246×246×440" } },
    { "danfoss": { "model": "HRP060T2LP6", "tr": 5, "w": "17,585", "btu": "60,000", "dimensions": "185 × 185 × 460", "code": "121L2297" }, "copeland": { "model": "ZR57K / ZR61K (TF5)", "tr": "4.8–5.1", "w": "16,700-17,900", "btu": "57,000-61,000", "dimensions": "246×246×440" } },
    { "danfoss": { "model": "HLP068T2LC6", "tr": 5.5, "w": "19,344", "btu": "66,000", "dimensions": "224 × 224 × 470", "code": "121L3276" }, "copeland": { "model": "ZR61K / ZR72K", "tr": "5.1–6.0", "w": "17,900-21,100", "btu": "61,000-72,000", "dimensions": "-" } },
    { "danfoss": { "model": "HLP075T2LC6", "tr": 6, "w": "21,102", "btu": "72,000", "dimensions": "224 × 224 × 480", "code": "121L3098" }, "copeland": { "model": "ZR72K-TF5", "tr": 6, "w": "21,100", "btu": "72,000", "dimensions": "254×254×460" } },
    { "danfoss": { "model": "HLP081T2LC6", "tr": 7, "w": "24,619", "btu": "84,000", "dimensions": "224 × 224 × 490", "code": "121L1916" }, "copeland": { "model": "ZR81KC-TF5", "tr": 6.8, "w": "24,000", "btu": "81,000", "dimensions": "254×254×470" } },
    { "danfoss": { "model": "HCP094T2LC6", "tr": 8, "w": "28,136", "btu": "96,000", "dimensions": "254 × 254 × 500", "code": "HCP094T2LC6" }, "copeland": { "model": "ZR94KC-TF5", "tr": 7.8, "w": "27,500", "btu": "94,000", "dimensions": "254×254×480" } },
    { "danfoss": { "model": "HCP120T2LC6", "tr": 10, "w": "35,170", "btu": "1,20,000", "dimensions": "280 × 280 × 530", "code": "121L0766" }, "copeland": { "model": "ZR125KC / ZR12M3", "tr": "10.4–10.5", "w": "36,600-37,000", "btu": "125,000-126,000", "dimensions": "280×280×530" } },
    { "danfoss": { "model": "HRP047T4LP6", "tr": 4, "w": "1,20,000", "btu": "1,20,000", "dimensions": "185 × 185 × 450", "code": "121L1046" }, "copeland": { "model": "ZR47K-TFD", "tr": 4, "w": "14,000", "btu": "47,000", "dimensions": "246×246×430" } },
    { "danfoss": { "model": "HRP054T4LP6", "tr": 4.5, "w": "15,827", "btu": "54,000", "dimensions": "185 × 185 × 460", "code": "121L1691" }, "copeland": { "model": "ZR54K-TFD", "tr": 4.5, "w": "15,800", "btu": "54,000", "dimensions": "246×246×440" } },
    { "danfoss": { "model": "HRP060T4LP6", "tr": 5, "w": "17,585", "btu": "60,000", "dimensions": "185 × 185 × 460", "code": "121L1726" }, "copeland": { "model": "ZR57K / ZR61K (TFD)", "tr": "4.8–5.1", "w": "16,700-17,900", "btu": "57,000-61,000", "dimensions": "246×246×440" } },
    { "danfoss": { "model": "HLP068T4LC6", "tr": 5.2, "w": "18,288", "btu": "62,400", "dimensions": "224 × 224 × 470", "code": "121L2014" }, "copeland": { "model": "ZR61K / ZR72K", "tr": "5.1–6.0", "w": "17,900-21,100", "btu": "61,000-72,000", "dimensions": "-" } },
    { "danfoss": { "model": "HLP075T4LC6", "tr": 6, "w": "21,102", "btu": "72,000", "dimensions": "224 × 224 × 480", "code": "121L1766" }, "copeland": { "model": "ZR72K-TFD", "tr": 6, "w": "21,100", "btu": "72,000", "dimensions": "254×254×460" } },
    { "danfoss": { "model": "HLP081T4LC6", "tr": 7, "w": "24,619", "btu": "84,000", "dimensions": "224 × 224 × 490", "code": "121L1781" }, "copeland": { "model": "ZR81KC-TFD", "tr": 6.8, "w": "24,000", "btu": "81,000", "dimensions": "254×254×470" } },
    { "danfoss": { "model": "HCP094T4LC6", "tr": 8, "w": "28,136", "btu": "96,000", "dimensions": "254 × 254 × 500", "code": "121L0601" }, "copeland": { "model": "ZR94KC-TFD", "tr": 7.8, "w": "27,500", "btu": "94,000", "dimensions": "254×254×480" } },
    { "danfoss": { "model": "HCP109T4LC6", "tr": 9, "w": "31,653", "btu": "1,08,000", "dimensions": "254 × 254 × 510", "code": "121L0376" }, "copeland": { "model": "ZR108KC / ZR11M3", "tr": 9, "w": "31,600", "btu": "1,08,000", "dimensions": "280×280×520" } },
    { "danfoss": { "model": "HCP120T4LC6", "tr": 10, "w": "35,170", "btu": "1,20,000", "dimensions": "280 × 280 × 530", "code": "121L0401" }, "copeland": { "model": "ZR12M3-TWD", "tr": 10.5, "w": "37,000", "btu": "1,26,000", "dimensions": "280×280×540" } }
  ],
  "S series": [
    { "danfoss": { "model": "SM090S3VC", "type": "S3", "tr": 7.5, "w": "26.4", "btu": "90,000", "dimensions": "465 × 280 × 280", "code": "SM090-3VI" }, "copeland": { "model": "ZR94KC-TF5", "type": "S3", "tr": 7.8, "w": "27.4", "btu": "94,000", "dimensions": "457 × 279 × 279" } },
    { "danfoss": { "model": "SM090S4VC", "type": "S4", "tr": 7.5, "w": "26.4", "btu": "90,000", "dimensions": "465 × 280 × 280", "code": "SM090-4VI" }, "copeland": { "model": "ZR94KC-TFD", "type": "S4", "tr": 7.8, "w": "27.4", "btu": "94,000", "dimensions": "457 × 279 × 279" } },
    { "danfoss": { "model": "SM115S3QC", "type": "S3", "tr": 9.3, "w": "32.7", "btu": "1,11,600", "dimensions": "505 × 300 × 300", "code": "SM115-3QAI" }, "copeland": { "model": "ZR11M3-TWC", "type": "S3", "tr": 9.3, "w": "32.7", "btu": "1,11,000", "dimensions": "500 × 290 × 290" } },
    { "danfoss": { "model": "SM115S4QC", "type": "S4", "tr": 9.3, "w": "32.7", "btu": "1,11,600", "dimensions": "505 × 300 × 300", "code": "SM115-4QAI" }, "copeland": { "model": "ZR11M3-TWD", "type": "S4", "tr": 9.3, "w": "32.7", "btu": "1,11,000", "dimensions": "500 × 290 × 290" } },
    { "danfoss": { "model": "SM125S3QC", "type": "S3", "tr": 10, "w": "35.2", "btu": "1,20,000", "dimensions": "505 × 300 × 300", "code": "SM125-3QAI" }, "copeland": { "model": "ZR12M3-TWC", "type": "S3", "tr": 10, "w": "35.2", "btu": "1,20,000", "dimensions": "500 × 290 × 290" } },
    { "danfoss": { "model": "SM125S4QC", "type": "S4", "tr": 10, "w": "35.2", "btu": "1,20,000", "dimensions": "505 × 300 × 300", "code": "SM125-4QAI" }, "copeland": { "model": "ZR12M3-TWD", "type": "S4", "tr": 10, "w": "35.2", "btu": "1,20,000", "dimensions": "500 × 290 × 290" } },
    { "danfoss": { "model": "SM160T3CC", "type": "S3", "tr": 12.5, "w": "44", "btu": "1,50,000", "dimensions": "545 × 320 × 320", "code": "SM160-3CBI" }, "copeland": { "model": "ZR16M3-TWC", "type": "S3", "tr": 12.5, "w": "44", "btu": "1,50,000", "dimensions": "540 × 310 × 310" } },
    { "danfoss": { "model": "SM160T4CC", "type": "S4", "tr": 12.5, "w": "44", "btu": "1,50,000", "dimensions": "545 × 320 × 320", "code": "SM160-4CBI" }, "copeland": { "model": "ZR16M3-TWD", "type": "S4", "tr": 12.5, "w": "44", "btu": "1,50,000", "dimensions": "540 × 310 × 310" } },
    { "danfoss": { "model": "SM175S3QC", "type": "S3", "tr": 14, "w": "49.2", "btu": "1,68,000", "dimensions": "575 × 340 × 340", "code": "SM175-3QAI" }, "copeland": { "model": "-", "type": "-", "tr": "-", "w": "-", "btu": "-", "dimensions": "-" } },
    { "danfoss": { "model": "SM175S4QC", "type": "S4", "tr": 14, "w": "49.2", "btu": "1,68,000", "dimensions": "575 × 340 × 340", "code": "SM175-4QAI" }, "copeland": { "model": "-", "type": "-", "tr": "-", "w": "-", "btu": "-", "dimensions": "-" } },
    { "danfoss": { "model": "SM185S3QC", "type": "S3", "tr": 15, "w": "52.8", "btu": "1,80,000", "dimensions": "575 × 340 × 340", "code": "SM185-3QAI" }, "copeland": { "model": "ZR19M3-TWC", "type": "S3", "tr": 15, "w": "52.8", "btu": "1,80,000", "dimensions": "570 × 330 × 330" } },
    { "danfoss": { "model": "SM185S4QC", "type": "S4", "tr": 15, "w": "52.8", "btu": "1,80,000", "dimensions": "575 × 340 × 340", "code": "SM185-4QAI" }, "copeland": { "model": "ZR19M3-TWD", "type": "S4", "tr": 15, "w": "52.8", "btu": "1,80,000", "dimensions": "570 × 330 × 330" } }
  ],
  "MLZ": [
    { "danfoss": { "model": "MLZ015", "tr": 0.9, "w": "3200", "btu": "10,800", "dimensions": "379 × 165 mm", "code": "MLZ015T4LP9" }, "copeland": { "model": "ZB15KCE-TFD", "tr": 1, "w": "3700", "btu": "12,000", "dimensions": "382x241x241" } },
    { "danfoss": { "model": "MLZ019", "tr": 1.1, "w": "3900", "btu": "13,200", "dimensions": "379 × 165 mm", "code": "MLZ019T4LP9" }, "copeland": { "model": "ZB19KCE-TFD", "tr": 1.1, "w": "3900", "btu": "13,200", "dimensions": "369x242x242" } },
    { "danfoss": { "model": "MLZ021", "tr": 1.4, "w": "5100", "btu": "16,800", "dimensions": "379 × 165 mm", "code": "MLZ021T4LP9" }, "copeland": { "model": "ZB21KCE-TFD", "tr": 1.4, "w": "5050", "btu": "16,800", "dimensions": "392-406x243-244x244" } },
    { "danfoss": { "model": "MLZ026", "tr": 1.7, "w": "5900", "btu": "20,400", "dimensions": "430 × 185 mm", "code": "MLZ026T4LP9" }, "copeland": { "model": "ZB26KCE-TFD", "tr": 1.7, "w": "5840", "btu": "20,400", "dimensions": "406x243x244" } },
    { "danfoss": { "model": "MLZ030", "tr": 1.9, "w": "6700", "btu": "22,800", "dimensions": "455 × 190 mm", "code": "MLZ030T4LP9" }, "copeland": { "model": "ZB29KCE-TFD", "tr": 1.9, "w": "6620", "btu": "22,800", "dimensions": "423x246x246" } },
    { "danfoss": { "model": "MLZ038", "tr": 2.4, "w": "8600", "btu": "28,800", "dimensions": "480 × 200 mm", "code": "MLZ038T4LP9" }, "copeland": { "model": "ZB38KCE-TFD", "tr": 2.4, "w": "8530", "btu": "28,800", "dimensions": "438x242x242" } },
    { "danfoss": { "model": "MLZ045", "tr": 2.9, "w": "10,200", "btu": "34,800", "dimensions": "520 × 210 mm", "code": "MLZ045T4LP9" }, "copeland": { "model": "ZB45KCE-TFD", "tr": 3.4, "w": "11900", "btu": "40,800", "dimensions": "438-458x242x242" } },
    { "danfoss": { "model": "MLZ048", "tr": 3.3, "w": "11700", "btu": "39,600", "dimensions": "540 × 215 mm", "code": "MLZ048T4LP9" }, "copeland": { "model": "ZB48KCE-TFD", "tr": 3.3, "w": "11650", "btu": "39,600", "dimensions": "480x246x284" } },
    { "danfoss": { "model": "MLZ058", "tr": 3.8, "w": "13400", "btu": "45,600", "dimensions": "580 × 230 mm", "code": "MLZ058T4LP9" }, "copeland": { "model": "ZB57KCE-TFD", "tr": 3.8, "w": "13200", "btu": "45,600", "dimensions": "442x246-263x256-263" } },
    { "danfoss": { "model": "MLZ066", "tr": 4.4, "w": "15600", "btu": "52,800", "dimensions": "620 × 250 mm", "code": "MLZ066T4LP9" }, "copeland": { "model": "ZB66KCE-TFD", "tr": 4.3, "w": "15100", "btu": "51600", "dimensions": "534x280x280" } },
    { "danfoss": { "model": "MLZ076", "tr": 5.2, "w": "18400", "btu": "62400", "dimensions": "650 × 260 mm", "code": "MLZ076T4LP9" }, "copeland": { "model": "ZB76KCE-TFD", "tr": 5.1, "w": "17850", "btu": "61200", "dimensions": "534x280x280" } }
  ],
  "DSH": [
    { "hz": 50, "danfoss": { "model": "DSH090A4AL", "tr": 7.5, "w": "20,048", "btu": "68,402", "dimensions": "485 X 230 X 243", "code": "DSH090A4AL" }, "copeland": { "model": "ZP90KCE-TFD", "tr": 7.5, "w": "-", "btu": "-", "dimensions": "533 x 501 x 242" } },
    { "hz": 50, "danfoss": { "model": "DSH105A4AL", "tr": 9, "w": "23,578", "btu": "80,449", "dimensions": "542 X 230X 243", "code": "DSH105A4AL" }, "copeland": { "model": "ZP103KCE-TFD", "tr": 9, "w": "-", "btu": "-", "dimensions": "534 x 501 x 242" } },
    { "hz": 50, "danfoss": { "model": "DSH120A4AL", "tr": 10, "w": "26,787", "btu": "91,396", "dimensions": "542 X 230X 243", "code": "DSH120A4AL" }, "copeland": { "model": "ZP120KCE-TFD", "tr": 10, "w": "-", "btu": "-", "dimensions": "535 x 501 x 242" } },
    { "hz": 50, "danfoss": { "model": "DSH140A4AL", "tr": 12, "w": "3,0370", "btu": "1,03,621", "dimensions": "542 X 230X 243", "code": "DSH140A4AL" }, "copeland": { "model": "ZP137KCE-TFD", "tr": 12, "w": "-", "btu": "-", "dimensions": "536 x 501 x 242" } },
    { "hz": 50, "danfoss": { "model": "DSH161A3AL", "tr": 13, "w": "34,894", "btu": "1,19,059", "dimensions": "542 X 230X 243", "code": "DSH161A3AL" }, "copeland": { "model": "ZP154KCE-TF5", "tr": 13.5, "w": "-", "btu": "-", "dimensions": "552 x 519 x 261" } },
    { "hz": 50, "danfoss": { "model": "DSH184A4AL", "tr": 15, "w": "39,036", "btu": "1,33,191", "dimensions": "558 X 230X 243", "code": "DSH184A4AL" }, "copeland": { "model": "ZP182KCE-TF5", "tr": 15, "w": "-", "btu": "-", "dimensions": "553 x 519 x 261" } },
    { "hz": 50, "danfoss": { "model": "DSH240A4AA*", "tr": 20, "w": "52,730", "btu": "1,79,920", "dimensions": "653 X 371 X 266", "code": "DSH240A4AA" }, "copeland": { "model": "ZP236KCE-TWD", "tr": 20, "w": "-", "btu": "-", "dimensions": "694 x 403x 385" } },
    { "hz": 50, "danfoss": { "model": "DSH295A4AA*", "tr": 25, "w": "64,520", "btu": "2,20,149", "dimensions": "653 X 371X 266", "code": "DSH295A4AA" }, "copeland": { "model": "ZP295KCE-TWD2", "tr": 25, "w": "-", "btu": "-", "dimensions": "725 x 448x392" } },
    { "hz": 60, "danfoss": { "model": "DSH090A3AL", "tr": 7.5, "w": "27,271", "btu": "93,730", "dimensions": "485 X 230 X 243", "code": "DSH090A3AL" }, "copeland": { "model": "ZP90KCE-TF5", "tr": 7.5, "w": "-", "btu": "-", "dimensions": "533 x 501 x 242" } },
    { "hz": 60, "danfoss": { "model": "DSH105A3AL", "tr": 9, "w": "32,279", "btu": "1,10,136", "dimensions": "542 X 230X 243", "code": "DSH105A3AL" }, "copeland": { "model": "ZP103KCE-TF5", "tr": 9, "w": "-", "btu": "-", "dimensions": "534 x 501 x 242" } },
    { "hz": 60, "danfoss": { "model": "DSH120A3AL", "tr": 10, "w": "36,629", "btu": "1,24,977", "dimensions": "542 X 230X 243", "code": "DSH120A3AL" }, "copeland": { "model": "ZP120KCE-TF5", "tr": 10, "w": "-", "btu": "-", "dimensions": "535 x 501 x 242" } },
    { "hz": 60, "danfoss": { "model": "DSH140A3AL", "tr": 12, "w": "41,510", "btu": "1,41,631", "dimensions": "542 X 230X 243", "code": "DSH140A3AL" }, "copeland": { "model": "ZP137KCE-TF5", "tr": 12, "w": "-", "btu": "-", "dimensions": "536 x 501 x 242" } },
    { "hz": 60, "danfoss": { "model": "DSH161A3AL", "tr": 13, "w": "47,222", "btu": "1,61,122", "dimensions": "542 X 230X 243", "code": "DSH161A3AL" }, "copeland": { "model": "ZP154KCE-TF", "tr": 13.5, "w": "-", "btu": "-", "dimensions": "552 x 519 x 261" } },
    { "hz": 60, "danfoss": { "model": "DSH184A3AL", "tr": 15, "w": "53,157", "btu": "1,81,371", "dimensions": "558 X 230X 243", "code": "DSH184A3AL" }, "copeland": { "model": "ZP182KCE-TF5", "tr": 15, "w": "-", "btu": "-", "dimensions": "553 x 519 x 261" } },
    { "hz": 60, "danfoss": { "model": "DSH240A3AA*", "tr": 20, "w": "71,760", "btu": "2,44,852", "dimensions": "653 X 371 X 266", "code": "DSH240A3AA" }, "copeland": { "model": "ZP236KCE-TW5", "tr": 20, "w": "-", "btu": "-", "dimensions": "694 x 403x 385" } },
    { "hz": 60, "danfoss": { "model": "DSH295A3AA*", "tr": 25, "w": "87,610", "btu": "2,98,934", "dimensions": "653 X 371X 266", "code": "DSH295A3AA" }, "copeland": { "model": "ZP295KCE-TW5", "tr": 25, "w": "-", "btu": "-", "dimensions": "725 x 448x392" } }
  ],
  "MT_MTZ": [
    { "danfoss": { "mt": "MT18", "mtz": "MTZ18", "capacity": "1.3" }, "copeland": { "model": "-", "capacity": "-" } },
    { "danfoss": { "mt": "MT22", "mtz": "MTZ22", "capacity": "1.5" }, "copeland": { "model": "CR22", "capacity": "1.3875" } },
    { "danfoss": { "mt": "MT28", "mtz": "MTZ28", "capacity": "1.9" }, "copeland": { "model": "CR29", "capacity": "2.02083" } },
    { "danfoss": { "mt": "MT32", "mtz": "MTZ32", "capacity": "2.2" }, "copeland": { "model": "CR30", "capacity": "1.95833" } },
    { "danfoss": { "mt": "MT36", "mtz": "MTZ36", "capacity": "2.5" }, "copeland": { "model": "CR36", "capacity": "2.28333" } },
    { "danfoss": { "mt": "MT40", "mtz": "MTZ40", "capacity": "2.8" }, "copeland": { "model": "CR42", "capacity": "2.69583" } },
    { "danfoss": { "mt": "MT44", "mtz": "MTZ44", "capacity": "3.1" }, "copeland": { "model": "CR47", "capacity": "3.13292" } },
    { "danfoss": { "mt": "MT50", "mtz": "MTZ50", "capacity": "3.5" }, "copeland": { "model": "CR53", "capacity": "3.53633" } },
    { "danfoss": { "mt": "MT56", "mtz": "MTZ56", "capacity": "3.9" }, "copeland": { "model": "CR57", "capacity": "3.8625" } },
    { "danfoss": { "mt": "MT64", "mtz": "MTZ64", "capacity": "4.4" }, "copeland": { "model": "CR62", "capacity": "4.24875" } }
  ]
};

const SERIES_INSIGHTS = {
  "H series": {
    summary: "Optimized for high-ambient residential and light commercial air conditioning.",
    advantage: "Superior part-load efficiency and compact scroll design for seamless integration.",
    fit: "Perfect drop-in for ZR25K to ZR61K models with standard mounting patterns."
  },
  "S series": {
    summary: "High-capacity scroll compressors designed for large commercial HVAC systems.",
    advantage: "Features dedicated S3 and S4 types for precise matching of system requirements.",
    fit: "Engineered to replace ZR94KC to ZR19M3 models with equivalent performance curves."
  },
  "MLZ": {
    summary: "Dedicated scroll solutions for medium-temperature refrigeration applications.",
    advantage: "High seasonal efficiency (SEER) and robust design for 24/7 cold chain reliability.",
    fit: "Directly cross-referenced with ZB15KCE to ZB76KCE Copeland refrigeration scrolls."
  },
  "DSH": {
    summary: "Next-generation scrolls with Intermediate Discharge Valves (IDVs) for maximum efficiency.",
    advantage: "IDV technology prevents over-compression, significantly boosting seasonal efficiency.",
    fit: "Optimized for ZP90KCE to ZP295KCE replacements in high-efficiency chillers."
  },
  "MT_MTZ": {
    summary: "Maneurop reciprocating compressors for versatile refrigeration needs.",
    advantage: "Handles varying cooling loads with ease; compatible with multiple refrigerants.",
    fit: "Reliable alternative to CR22 through CR62 series reciprocating units."
  }
};

const USE_CASES = [
  { label: "Residential", icon: ShieldCheck, filter: "H series" },
  { label: "Commercial", icon: Award, filter: "S series" },
  { label: "Refrigeration", icon: Zap, filter: "MLZ" },
  { label: "High Efficiency", icon: Brain, filter: "DSH" }
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/40 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "red", className = "" }) => {
  const variants = {
    red: "bg-red-50 text-red-700 border-red-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const ComparisonRow = ({ label, danfossValue, copelandValue, icon: Icon, isSubHeader = false, isBetter = null, explanation = null, tooltip = null }) => (
  <div className="group relative">
    <div className={`grid grid-cols-12 py-2 border-b border-slate-200 last:border-0 hover:bg-slate-50/50 transition-colors px-4 ${isSubHeader ? "bg-slate-100/50 font-bold" : ""}`}>
      <div className="col-span-4 flex items-center gap-2 group/tip relative">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        <span className={`text-xs ${isSubHeader ? "text-slate-700" : "text-slate-500 font-medium"}`}>{label}</span>
        {tooltip && (
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tip:block z-[60] w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl">
            {tooltip}
          </div>
        )}
      </div>
      <div className={`col-span-4 text-xs px-2 border-l border-slate-100 flex items-center gap-2 ${isSubHeader ? "text-slate-900" : isBetter === true ? "text-green-600 font-black" : "text-red-700 font-semibold"}`}>
        {danfossValue || <span className="text-slate-300 italic">-</span>}
        {isBetter === true && <Zap className="w-3 h-3 fill-green-600 text-green-600" />}
      </div>
      <div className={`col-span-4 text-xs px-2 border-l border-slate-100 flex items-center gap-2 ${isSubHeader ? "text-slate-900" : isBetter === false ? "text-green-600 font-black" : "text-slate-600 font-medium"}`}>
        {copelandValue || <span className="text-slate-300 italic">-</span>}
        {isBetter === false && <Zap className="w-3 h-3 fill-green-600 text-green-600" />}
      </div>
    </div>
    {explanation && (
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        className="px-4 pb-2 bg-slate-50/80 overflow-hidden"
      >
        <p className="text-[10px] text-slate-400 font-medium italic">💡 {explanation}</p>
      </motion.div>
    )}
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState("H series");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [explainMode, setExplainMode] = useState(false);
  const [activeUseCase, setActiveUseCase] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const smartSearch = (query) => {
    const q = query.toLowerCase();
    if (q.includes("cold") || q.includes("refrig")) return "MLZ";
    if (q.includes("high efficiency") || q.includes("data center")) return "DSH";
    if (q.includes("residential") || q.includes("home")) return "H series";
    if (q.includes("commercial") || q.includes("large")) return "S series";
    return null;
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const smartCategory = smartSearch(query);
    
    let baseData = [];
    if (smartCategory) {
      baseData = (COMPRESSOR_DATA[smartCategory] || []).map(item => ({ ...item, category: smartCategory }));
    } else if (activeUseCase) {
      baseData = (COMPRESSOR_DATA[activeUseCase] || []).map(item => ({ ...item, category: activeUseCase }));
    } else if (!query) {
      baseData = (COMPRESSOR_DATA[activeTab] || []).map(item => ({ ...item, category: activeTab }));
    } else {
      Object.entries(COMPRESSOR_DATA).forEach(([category, items]) => {
        items.forEach(item => {
          baseData.push({ ...item, category });
        });
      });
    }

    if (!query || smartCategory) return baseData;

    return baseData.filter(item => {
      const danfossMatch = Object.values(item.danfoss || {}).some(val => 
        String(val).toLowerCase().includes(query)
      );
      const copelandMatch = Object.values(item.copeland || {}).some(val => 
        String(val).toLowerCase().includes(query)
      );
      return danfossMatch || copelandMatch;
    });
  }, [activeTab, searchQuery, activeUseCase]);

  useEffect(() => {
    if ((searchQuery || activeUseCase) && filteredData.length > 0) {
      setSelectedModel(0);
    } else if (!searchQuery && !activeUseCase) {
      setSelectedModel(null);
    }
  }, [searchQuery, filteredData.length, activeUseCase]);

  useEffect(() => {
    const handleKey = (e) => {
      if (selectedModel === null && filteredData.length > 0) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") setSelectedModel(0);
        return;
      }
      if (e.key === "ArrowDown") {
        setSelectedModel(prev => Math.min(prev + 1, filteredData.length - 1));
      }
      if (e.key === "ArrowUp") {
        setSelectedModel(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedModel, filteredData]);

  const isBetter = (d, c) => {
    if (!d || !c || d === "-" || c === "-") return null;
    const parseValue = (val) => {
      const cleaned = String(val).replace(/,/g, '').split('–')[0].split('-')[0].trim();
      return parseFloat(cleaned);
    };
    const dv = parseValue(d);
    const cv = parseValue(c);
    if (isNaN(dv) || isNaN(cv)) return null;
    return dv > cv;
  };

  const calculateVerdict = (item) => {
    if (!item) return null;
    let danfossWins = 0;
    let totalMetrics = 0;
    
    const metrics = ['tr', 'w', 'btu'];
    metrics.forEach(m => {
      if (item.danfoss?.[m] && item.copeland?.[m]) {
        totalMetrics++;
        if (isBetter(item.danfoss[m], item.copeland[m])) danfossWins++;
      }
    });
    
    return {
      wins: danfossWins,
      total: totalMetrics,
      score: totalMetrics > 0 ? Math.round((danfossWins / totalMetrics) * 100) : 95
    };
  };

  const currentVerdict = useMemo(() => calculateVerdict(filteredData[selectedModel]), [selectedModel, filteredData]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      <AnimatePresence> 
        {showIntro && ( 
          <motion.div 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center" 
          > 
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="text-center"
            > 
              <img src="/Outlook-kvcuysmb.png" alt="Danfoss" className="h-16 w-auto mx-auto mb-6" />
              <h1 className="text-3xl font-black text-red-600"> 
                Staying Ahead 
              </h1> 
              <p className="text-sm text-slate-500 text-center mt-2"> 
                Engineering Efficiency 
              </p> 
            </motion.div> 
          </motion.div> 
        )} 
      </AnimatePresence>

      <nav className="sticky top-0 z-50 bg-white/40 backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.05)] px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 group cursor-pointer">
            <img src="/Outlook-kvcuysmb.png" alt="Danfoss Logo" className="h-8 md:h-10 w-auto" />
            <div className="h-8 w-px bg-slate-200 hidden lg:block" />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">Staying Ahead</h1>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-red-600 font-bold">Compressor Comparison</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
            {Object.keys(COMPRESSOR_DATA).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedModel(null); setActiveUseCase(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab && !activeUseCase
                    ? "bg-white text-red-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setExplainMode(!explainMode)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border ${
                explainMode 
                  ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-200" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-red-200 hover:text-red-600"
              }`}
            >
              <Info className="w-3 md:w-3.5 h-3 md:h-3.5" />
              <span className="hidden xs:inline">{explainMode ? "Explain Mode ON" : "Explain Mode OFF"}</span>
              <span className="xs:hidden">{explainMode ? "ON" : "OFF"}</span>
            </button>

            <div className="relative hidden md:block">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? "text-red-600" : "text-slate-400"}`} />
              <input 
                type="text"
                placeholder="Describe your requirement..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedModel(null);
                }}
                className={`pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 rounded-xl text-sm w-48 lg:w-64 transition-all outline-none ${
                  searchQuery ? "ring-2 ring-red-200 bg-white" : ""
                }`}
              />
            </div>

            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="relative md:hidden">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? "text-red-600" : "text-slate-400"}`} />
                  <input 
                    type="text"
                    placeholder="Describe requirement..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedModel(null);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(COMPRESSOR_DATA).map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setSelectedModel(null); setActiveUseCase(null); setMobileMenuOpen(false); }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === tab && !activeUseCase
                          ? "bg-red-600 text-white" 
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200/20 blur-3xl rounded-full animate-pulse z-0" />
        <div className="absolute top-40 right-10 w-48 h-48 bg-blue-200/10 blur-3xl rounded-full animate-bounce z-0" />

        <section className="mb-16 relative z-10" id="hero" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <Badge variant="red">Efficiency First</Badge>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
                Superior Performance <br className="hidden sm:block"/>
                <span className="text-red-600">By Design.</span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 mt-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Compare Danfoss scroll compressors with industry alternatives. 
                Experience the "Staying Ahead" advantage with optimized cooling capacity.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-8">
                {USE_CASES.map(uc => (
                  <button
                    key={uc.label}
                    onClick={() => { setActiveUseCase(uc.filter); setActiveTab(uc.filter); setSelectedModel(null); }}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all border ${
                      activeUseCase === uc.filter 
                        ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-100" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-red-200 hover:text-red-600"
                    }`}
                  >
                    <uc.icon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                    {uc.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-center lg:justify-start gap-4 md:gap-8 mt-10">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-xs md:text-sm">Certified</p>
                    <p className="text-[10px] text-slate-500">Industry Standards</p>
                  </div>
                </div>
                <div className="w-px h-10 md:h-12 bg-slate-200" />
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <Award className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-xs md:text-sm">Premium</p>
                    <p className="text-[10px] text-slate-500">Quality Assured</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-md mx-auto lg:max-w-none w-full"
            >
              <div className="absolute -inset-4 bg-red-500/10 blur-3xl rounded-full" />
              <Card className="relative p-6 md:p-8 bg-gradient-to-br from-red-600 to-red-800 text-white border-0 shadow-2xl">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <Zap className="w-8 md:w-10 h-8 md:h-10 text-red-200 fill-red-200" />
                  <div className="text-right">
                    <p className="text-red-100 text-[10px] md:text-xs font-bold uppercase tracking-wider">Market Leader</p>
                    <p className="text-xl md:text-2xl font-black">DANFOSS</p>
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div className="p-3 md:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <p className="text-[10px] md:text-xs text-red-100 mb-1 font-medium">Core Advantage</p>
                    <p className="text-xs md:text-sm font-semibold leading-snug">
                      Engineered for high-ambient performance and maximum energy efficiency across all applications.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${currentVerdict?.score || 95}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-red-300"
                      />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">{currentVerdict?.score || 95}% Match Confidence</span>
                      <span className="text-[8px] font-black uppercase tracking-tighter text-red-200">High Confidence</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="mb-16 md:mb-24 relative z-10">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-6 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
            <div className="relative z-10">
              <Badge variant="red">Series Insights</Badge>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-4 mb-6 md:mb-8">
                {activeTab} Overview <br/>
                <span className="text-red-600">The Danfoss Advantage.</span>
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="p-4 md:p-5 bg-white/60 rounded-xl md:rounded-2xl border border-white/40 sm:col-span-2">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-red-600 text-white rounded-lg flex items-center justify-center mb-4">
                    <Info className="w-4 md:w-5 h-4 md:h-5" />
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm md:text-base mb-2">Series Summary</h5>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    {SERIES_INSIGHTS[activeTab]?.summary}
                  </p>
                </div>
                <div className="p-4 md:p-5 bg-white/60 rounded-xl md:rounded-2xl border border-white/40">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-4 md:w-5 h-4 md:h-5" />
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm md:text-base mb-2">Core Strength</h5>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {SERIES_INSIGHTS[activeTab]?.advantage}
                  </p>
                </div>
                <div className="p-4 md:p-5 bg-white/60 rounded-xl md:rounded-2xl border border-white/40">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                    <ArrowRightLeft className="w-4 md:w-5 h-4 md:h-5" />
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm md:text-base mb-2">Seamless Fit</h5>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {SERIES_INSIGHTS[activeTab]?.fit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10">
          <motion.div 
            key={activeTab + searchQuery} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                  {searchQuery ? "Intelligent Results" : `${activeTab} Comparison`}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm">
                  {searchQuery ? `Analyzing requirements for "${searchQuery}"` : "Select a model for technical specifications"}
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  <Filter className="w-3.5 md:w-4 h-3.5 md:h-4" />
                  <span>{filteredData.length} Models Found</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-1 space-y-3 max-h-[400px] lg:max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item, idx) => {
                    const modelName = item.danfoss?.model || item.danfoss?.mt || "N/A";
                    const isSelected = selectedModel === idx;
                    return (
                      <motion.div
                        layout
                        key={modelName + idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => { setSelectedModel(idx); if (window.innerWidth < 1024) { window.scrollTo({ top: document.getElementById('details-section').offsetTop - 100, behavior: 'smooth' }); }}}
                        onMouseEnter={() => { if (window.innerWidth >= 1024) setSelectedModel(idx); }}
                        className={`group p-3 md:p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          isSelected 
                            ? "bg-white border-red-600 shadow-md ring-4 ring-red-50" 
                            : "bg-white border-transparent hover:border-slate-200 shadow-sm hover:shadow-md"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 md:w-10 h-8 md:h-10 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected ? "bg-red-600 text-white" : "bg-red-50 text-red-600"
                            }`}>
                              <Maximize2 className="w-4 md:w-5 h-4 md:h-5" />
                            </div>
                            <div>
                              <p className={`font-bold text-xs md:text-sm ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                                {modelName}
                              </p>
                              <div className="flex flex-col gap-0.5 mt-0.5">
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                                  {item.danfoss?.tr || item.danfoss?.capacity} TR
                                </p>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 md:w-5 h-4 md:h-5 transition-transform ${isSelected ? "text-red-600 translate-x-1" : "text-slate-300"}`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="lg:col-span-2" id="details-section">
                {selectedModel !== null ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={selectedModel}
                  >
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                      <Card className="p-3 md:p-4 bg-green-50/50 border-green-100">
                        <div className="flex items-center gap-2 mb-1.5 md:mb-2 text-green-800">
                          <Check className="w-3.5 md:w-4 h-3.5 md:h-4" />
                          <h4 className="font-bold text-xs md:text-sm">Final Verdict</h4>
                        </div>
                        <p className="text-[10px] md:text-xs text-green-700 leading-relaxed">
                          Danfoss outperforms Copeland in {currentVerdict?.wins}/{currentVerdict?.total} key technical metrics.
                        </p>
                      </Card>
                      <Card className="p-3 md:p-4 bg-red-50/50 border-red-100">
                        <div className="flex items-center gap-2 mb-1.5 md:mb-2 text-red-800">
                          <Zap className="w-3.5 md:w-4 h-3.5 md:h-4" />
                          <h4 className="font-bold text-xs md:text-sm">Smart Suggestion</h4>
                        </div>
                        <p className="text-[10px] md:text-xs text-red-700 leading-relaxed">
                          Ideal for {filteredData[selectedModel].category === 'MLZ' ? 'Refrigeration' : 'High-Ambient AC'} use cases.
                        </p>
                      </Card>
                    </div>

                    <Card className="h-full border-slate-200">
                      <div className="bg-red-600 p-4 md:p-6 text-white flex justify-between items-center">
                        <div>
                          <p className="text-red-200 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Detailed Technical View</p>
                          <h4 className="text-xl md:text-2xl font-bold">
                            {filteredData[selectedModel].danfoss?.model || filteredData[selectedModel].danfoss?.mt}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-[9px] md:text-[10px] text-red-100 uppercase font-bold">Match Score</p>
                            <p className="text-xl md:text-2xl font-black">{currentVerdict?.score}%</p>
                          </div>
                          <ArrowRightLeft className="w-6 md:w-8 h-6 md:h-8 text-white/30" />
                        </div>
                      </div>
                      
                      <div className="p-4 md:p-8">
                        <div className="grid grid-cols-12 mb-2 bg-yellow-400 p-2 md:p-3 rounded-t-xl border-x border-t border-slate-300 sticky top-0 z-10 shadow-sm">
                          <div className="col-span-4 text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-wider flex items-center">Specs</div>
                          <div className="col-span-4 text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-wider border-l border-slate-600/20 px-2 md:px-3 text-center sm:text-left">Danfoss</div>
                          <div className="col-span-4 text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-wider border-l border-slate-600/20 px-2 md:px-3 text-center sm:text-left">Copeland</div>
                        </div>

                        <div className="bg-white rounded-b-xl overflow-hidden border border-slate-300 shadow-sm">
                          {filteredData[selectedModel].category === "MT_MTZ" ? (
                            <>
                              <ComparisonRow 
                                label="Variant" 
                                danfossValue={`MT: ${filteredData[selectedModel].danfoss?.mt} / MTZ: ${filteredData[selectedModel].danfoss?.mtz}`} 
                                copelandValue={filteredData[selectedModel].copeland?.model} 
                                icon={Maximize2}
                                tooltip="Danfoss MT/MTZ offers flexibility for various refrigeration oils."
                                explanation={explainMode ? "Different variants optimized for specific refrigerants and oil types." : null}
                              />
                              <ComparisonRow 
                                label="TR" 
                                danfossValue={filteredData[selectedModel].danfoss?.capacity} 
                                copelandValue={filteredData[selectedModel].copeland?.capacity} 
                                icon={Zap}
                                tooltip="TR = Tons of Refrigeration. 1 TR = 3.5 kW."
                                isBetter={isBetter(filteredData[selectedModel].danfoss?.capacity, filteredData[selectedModel].copeland?.capacity)}
                                explanation={explainMode ? "Tonnage Refrigeration (TR) defines the cooling power." : null}
                              />
                            </>
                          ) : (
                            <>
                              <ComparisonRow 
                                label="Model" 
                                danfossValue={filteredData[selectedModel].danfoss?.model} 
                                copelandValue={filteredData[selectedModel].copeland?.model} 
                                icon={Maximize2}
                                isSubHeader={true}
                              />
                              {filteredData[selectedModel].danfoss?.type && (
                                <ComparisonRow 
                                  label="Type" 
                                  danfossValue={filteredData[selectedModel].danfoss?.type} 
                                  copelandValue={filteredData[selectedModel].copeland?.type} 
                                  icon={Info}
                                  tooltip="Mechanical architecture: S3 vs S4 optimization."
                                  explanation={explainMode ? "Defines the internal mechanical architecture." : null}
                                />
                              )}
                              {filteredData[selectedModel].category === "DSH" && (
                                <ComparisonRow 
                                  label="Hz" 
                                  danfossValue={`${filteredData[selectedModel].hz} Hz`} 
                                  copelandValue="-" 
                                  icon={Info}
                                  tooltip="Operational frequency standard."
                                  explanation={explainMode ? "Standard electrical frequency." : null}
                                />
                              )}
                              <ComparisonRow 
                                label="TR" 
                                danfossValue={filteredData[selectedModel].danfoss?.tr} 
                                copelandValue={filteredData[selectedModel].copeland?.tr} 
                                icon={Zap}
                                tooltip="Cooling capacity in tons. 1 TR = 12,000 BTU/hr."
                                isBetter={isBetter(filteredData[selectedModel].danfoss?.tr, filteredData[selectedModel].copeland?.tr)}
                                explanation={explainMode ? "Total cooling capacity in Tons of Refrigeration." : null}
                              />
                              <ComparisonRow 
                                label="W" 
                                danfossValue={filteredData[selectedModel].danfoss?.w} 
                                copelandValue={filteredData[selectedModel].copeland?.w} 
                                icon={CheckCircle2}
                                tooltip="Wattage defines total electrical cooling power."
                                isBetter={isBetter(filteredData[selectedModel].danfoss?.w, filteredData[selectedModel].copeland?.w)}
                                explanation={explainMode ? "Cooling power measured in Watts." : null}
                              />
                              <ComparisonRow 
                                label="Btu/hr" 
                                danfossValue={filteredData[selectedModel].danfoss?.btu} 
                                copelandValue={filteredData[selectedModel].copeland?.btu} 
                                icon={CheckCircle2}
                                tooltip="BTU = British Thermal Units. Standard US cooling metric."
                                isBetter={isBetter(filteredData[selectedModel].danfoss?.btu, filteredData[selectedModel].copeland?.btu)}
                                explanation={explainMode ? "British Thermal Units per hour." : null}
                              />
                              <ComparisonRow 
                                label="mm" 
                                danfossValue={filteredData[selectedModel].danfoss?.dimensions} 
                                copelandValue={filteredData[selectedModel].copeland?.dimensions} 
                                icon={Maximize2}
                                tooltip="Physical footprint. Smaller allows for easier retrofitting."
                                explanation={explainMode ? "Physical size." : null}
                              />
                              {filteredData[selectedModel].danfoss?.code && (
                                <ComparisonRow 
                                  label="Code" 
                                  danfossValue={filteredData[selectedModel].danfoss?.code} 
                                  copelandValue="-" 
                                  icon={Filter}
                                  tooltip="Use this exact code for procurement and ordering."
                                  explanation={explainMode ? "Unique identifier for placing orders." : null}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl border-2 border-dashed border-white/40 p-8 md:p-12 text-center rounded-2xl min-h-[300px]">
                    <div className="w-16 md:w-20 h-16 md:h-20 bg-white/60 rounded-full flex items-center justify-center mb-6">
                      <Brain className="w-8 md:w-10 h-8 md:h-10 text-red-300" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-slate-800 px-4">Describe requirement or select a model</h4>
                    <p className="text-slate-500 max-w-xs mt-2 text-xs md:text-sm px-4">
                      Try "5 ton commercial" or select from the list.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12 px-6 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white p-1 rounded-lg">
                <img src="/Outlook-kvcuysmb.png" alt="Danfoss Logo" className="h-8 w-auto" />
              </div>
              <span className="text-xl font-bold tracking-tight">Staying Ahead</span>
            </div>
            <p className="text-slate-400 text-xs max-w-xs">
              Empowering engineers with precise data for better cooling solutions. © 2026 Danfoss Comparison Tool.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Contact</p>
              <p className="text-sm text-slate-300">Sales Support</p>
              <p className="text-sm text-slate-300">Technical Help</p>
            </div>
            <div>
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Resources</p>
              <p className="text-sm text-slate-300">Documentation</p>
              <p className="text-sm text-slate-300">Case Studies</p>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.4);
        }
      `}} />
    </div>
  );
};

export default App;
