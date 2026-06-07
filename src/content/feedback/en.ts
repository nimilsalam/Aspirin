// English feedback content registry (Park-based defaults).
// A clinician can overwrite any `doctorMessage` / set `audioUrl` here without
// touching app logic. Bands not listed simply produce no card.

import type { FeedbackRegistry } from '../../lib/types';

export const en: FeedbackRegistry = {
  diabetesRisk: {
    low: {
      title: 'Low chance of diabetes',
      whatThisMeans: 'Your chance of getting diabetes (sugar disease) is low right now. Keep it that way.',
      doctorMessage:
        'You are doing well. Stay active and keep your tummy size in check — most diabetes in India can be prevented.',
      actionSteps: [
        'Stay active most days of the week.',
        'Go easy on sugar and white rice.',
        'After age 30, get a sugar blood test once a year.',
      ],
    },
    moderate: {
      title: 'Some chance of diabetes',
      whatThisMeans:
        'You have a fair chance of getting diabetes (sugar disease) in the next few years.',
      doctorMessage:
        'This is the best time to act — before your sugar goes up. Small changes every day can stop diabetes from starting.',
      actionSteps: [
        'Walk at least 30 minutes a day.',
        'Cut down sugar, sweets and cool drinks.',
        'Eat less rice; add more vegetables and dal.',
        'Get a sugar blood test done.',
      ],
      seeDoctor: true,
    },
    high: {
      title: 'High chance of diabetes',
      whatThisMeans:
        'You have a high chance of getting diabetes (sugar disease). Your blood sugar may already be high.',
      doctorMessage:
        'Please get a blood test for sugar soon. With the right food and daily walking, many people bring their sugar back to normal.',
      actionSteps: [
        'Get a blood sugar test this week.',
        'Walk 30–45 minutes every day.',
        'Avoid sugar, sweets, fried snacks and cool drinks.',
        'Eat less rice; fill half your plate with vegetables.',
      ],
      seeDoctor: true,
    },
    present: {
      title: 'You have diabetes',
      whatThisMeans:
        'A doctor has told you that you have diabetes. Good control protects your eyes, kidneys, nerves and heart.',
      doctorMessage:
        'Keep taking your medicines and keep up the food and walking. Small daily habits keep your sugar steady and prevent problems later.',
      actionSteps: [
        'Take your medicines as prescribed.',
        'Check your sugar regularly, as your doctor advises.',
        'Avoid sugar, sweets and cool drinks; eat less rice.',
        'Walk 30+ minutes daily and check your feet often.',
      ],
      seeDoctor: true,
    },
  },

  bloodPressure: {
    normal: {
      title: 'Healthy blood pressure',
      whatThisMeans: 'Your blood pressure is in the normal range.',
      doctorMessage:
        'Your blood pressure is good. Keep your salt low and stay active to protect your heart.',
      actionSteps: ['Keep salt under 1 teaspoon (5 g) a day.', 'Check your BP once a year.'],
    },
    elevated: {
      title: 'Blood pressure on the higher side',
      whatThisMeans:
        'Your blood pressure is a little above normal. This is the warning stage before high blood pressure.',
      doctorMessage:
        'This is the stage to fix things naturally. Lower your salt, lose a little weight and stay active — you can avoid medicines.',
      actionSteps: [
        'Reduce salt, pickles, papad and packaged snacks.',
        'Walk daily and lose excess weight.',
        'Limit alcohol; stop tobacco.',
      ],
      dietPlan: {
        heading: 'DASH-style eating',
        items: [
          'Plenty of fruits and vegetables every day',
          'Whole grains instead of white rice/maida',
          'Low-fat milk and curd',
          'Less salt, less fried and oily food',
        ],
      },
    },
    present: {
      title: 'You have high blood pressure',
      whatThisMeans:
        'A doctor has told you that you have high blood pressure. Keeping it controlled protects your heart, brain and kidneys.',
      doctorMessage:
        'Keep taking your medicines every day, even when you feel fine. Check your BP regularly, cut down salt, and stay active.',
      actionSteps: [
        'Take your BP medicines every day as prescribed.',
        'Check your blood pressure regularly.',
        'Keep salt under 5 g/day; follow the DASH diet.',
        'Stay active; limit alcohol; stop tobacco.',
      ],
      dietPlan: {
        heading: 'DASH diet',
        items: [
          'Fruits and vegetables at every meal',
          'Whole grains, pulses and nuts',
          'Low-fat dairy',
          'Avoid added salt, pickles and processed food',
        ],
      },
      seeDoctor: true,
    },
    stage1: {
      title: 'High blood pressure (Stage 1)',
      whatThisMeans: 'Your readings are in the hypertension range.',
      doctorMessage:
        'Please see a doctor to confirm with repeat readings. Along with lifestyle changes, you may need treatment to protect your heart, brain and kidneys.',
      actionSteps: [
        'See a doctor to confirm and discuss treatment.',
        'Strictly reduce salt to under 5 g/day.',
        'Walk daily; lose weight if overweight.',
        'Stop tobacco and limit alcohol.',
      ],
      dietPlan: {
        heading: 'DASH diet',
        items: [
          'Fruits and vegetables at every meal',
          'Whole grains, pulses and nuts',
          'Low-fat dairy',
          'Avoid added salt, pickles and processed food',
        ],
      },
      seeDoctor: true,
    },
    stage2: {
      title: 'Very high blood pressure (Stage 2)',
      whatThisMeans: 'Your blood pressure is markedly raised and needs prompt attention.',
      doctorMessage:
        'Please consult a doctor soon. Very high blood pressure needs proper evaluation and usually medication, along with the diet and lifestyle changes.',
      actionSteps: [
        'See a doctor without delay.',
        'Follow the DASH diet and cut salt strictly.',
        'Take medicines exactly as prescribed.',
        'Monitor your BP regularly.',
      ],
      seeDoctor: true,
    },
    unknown: {
      title: 'Blood pressure not known',
      whatThisMeans: 'You have not measured your blood pressure recently.',
      doctorMessage:
        'High blood pressure usually has no symptoms. Please get it checked — it takes two minutes at any clinic or pharmacy.',
      actionSteps: ['Get your blood pressure checked.', 'Keep your salt intake low.'],
    },
  },

  lipids: {
    normal: {
      title: 'Healthy cholesterol',
      whatThisMeans: 'Your cholesterol values look good.',
      doctorMessage: 'Good cholesterol levels — keep eating well and staying active.',
      actionSteps: ['Continue a balanced, low-fried diet.', 'Stay physically active.'],
    },
    borderline: {
      title: 'Cholesterol a little high',
      whatThisMeans:
        'The fat (cholesterol) in your blood is a little high. Over time this can harm your heart.',
      doctorMessage:
        'You can fix this with food and walking. Cut down fried and bakery foods, and move more every day.',
      actionSteps: [
        'Cut down fried food, ghee, dalda and bakery items.',
        'Eat more vegetables, fruits and dal.',
        'Walk daily; lose extra weight.',
      ],
    },
    high: {
      title: 'High cholesterol',
      whatThisMeans:
        'The fat (cholesterol) in your blood is high. This raises your chance of heart disease.',
      doctorMessage:
        'Please talk to a doctor. Food and walking help, and some people need medicine to protect the heart.',
      actionSteps: [
        'See a doctor to check your cholesterol.',
        'Avoid fried, oily and bakery foods.',
        'Eat more vegetables and dal; walk daily.',
        'Stop tobacco.',
      ],
      seeDoctor: true,
    },
    unknown: {
      title: 'Cholesterol not tested',
      whatThisMeans: 'You have not entered a lipid (cholesterol) test result.',
      doctorMessage:
        'If you have other risks like obesity or family history, get a simple lipid blood test done.',
      actionSteps: ['Consider a lipid profile test.', 'Eat less fried and oily food.'],
    },
  },

  weight: {
    underweight: {
      title: 'Underweight',
      whatThisMeans: 'Your BMI is below the healthy range.',
      doctorMessage:
        'Being underweight can also affect health. Eat balanced, energy-rich meals and check with a doctor if you are losing weight unintentionally.',
      actionSteps: [
        'Eat regular, balanced meals with enough protein.',
        'See a doctor if you are losing weight without trying.',
      ],
    },
    normal: {
      title: 'Healthy weight',
      whatThisMeans: 'Your BMI is in the healthy range for Indians.',
      doctorMessage: 'Great — a healthy weight protects you from many diseases. Keep it up.',
      actionSteps: ['Maintain your weight with activity and balanced food.'],
    },
    overweight: {
      title: 'Overweight',
      whatThisMeans:
        'Your BMI is above the healthy range (Asian cutoff). Even small weight loss helps a lot.',
      doctorMessage:
        'Losing even 5% of your weight noticeably lowers your risk of diabetes and high blood pressure. Start with daily walking and smaller portions.',
      actionSteps: [
        'Aim to lose 5–10% of your weight over a few months.',
        'Walk 30+ minutes daily.',
        'Smaller rice portions; more vegetables.',
        'Avoid sugary drinks and fried snacks.',
      ],
    },
    obese: {
      title: 'Obesity',
      whatThisMeans:
        'Your BMI is in the obese range, which raises risk for diabetes, blood pressure and joint problems.',
      doctorMessage:
        'Weight loss is the single most powerful thing you can do for your health. Set small, steady goals — it works.',
      actionSteps: [
        'Set a steady weight-loss goal with a doctor or dietitian.',
        'Be active most days; build up gradually.',
        'Cut sugar, fried food and large portions.',
        'Watch your waist size, not just weight.',
      ],
      seeDoctor: true,
    },
  },

  physicalActivity: {
    adequate: {
      title: 'Good activity level',
      whatThisMeans: 'You meet the recommended physical-activity target.',
      doctorMessage: 'Excellent — staying active is one of the best things for your health.',
      actionSteps: ['Keep up at least 150 minutes of activity a week.'],
    },
    insufficient: {
      title: 'Not active enough',
      whatThisMeans: 'You are active, but below the recommended 150 minutes a week.',
      doctorMessage:
        'A little more movement goes a long way. Add a brisk walk most days and you will feel the difference.',
      actionSteps: ['Build up to 30 minutes of brisk walking, 5 days a week.'],
      exercisePlan: {
        heading: 'Simple weekly plan',
        items: [
          '5 days: 30 min brisk walking',
          '2 days: simple strengthening (squats, wall push-ups)',
          'Take stairs; walk after meals',
        ],
      },
    },
    sedentary: {
      title: 'Very low activity',
      whatThisMeans: 'You are mostly inactive, which raises risk for many diseases.',
      doctorMessage:
        'Start small — even 10 minutes of walking a day is a great beginning. Increase slowly week by week.',
      actionSteps: [
        'Start with 10–15 minutes of walking daily.',
        'Slowly increase to 30 minutes most days.',
        'Reduce long sitting; stand and move every hour.',
      ],
      exercisePlan: {
        heading: 'Starter weekly plan',
        items: [
          'Week 1–2: 10–15 min walk daily',
          'Week 3–4: 20–25 min walk daily',
          'Then: 30 min brisk walk + 2 days light strengthening',
        ],
      },
    },
  },

  diet: {
    healthy: {
      title: 'Healthy diet',
      whatThisMeans: 'Your eating pattern looks balanced.',
      doctorMessage: 'Good eating habits — keep enjoying plenty of vegetables and whole foods.',
      actionSteps: ['Keep salt and sugar low.', 'Continue eating fruits and vegetables daily.'],
    },
    needsImprovement: {
      title: 'Diet can be improved',
      whatThisMeans: 'Your diet has some gaps — often low fruit/veg or high salt.',
      doctorMessage:
        'A few simple swaps make a big difference: more vegetables, less salt and fewer fried snacks.',
      actionSteps: [
        'Add a vegetable or fruit to every meal.',
        'Reduce salt, pickles and packaged snacks.',
        'Replace some white rice with whole grains.',
      ],
    },
    poor: {
      title: 'Unhealthy diet',
      whatThisMeans:
        'Your diet is high in salt, sugar or fried/processed food and low in fruits and vegetables.',
      doctorMessage:
        'Food is medicine here. Cooking more at home and adding vegetables daily will improve almost every number in this report.',
      actionSteps: [
        'Eat home-cooked meals; avoid packaged and fried food.',
        'Fill half your plate with vegetables.',
        'Cut sugary drinks and sweets.',
        'Reduce salt to under 5 g/day.',
      ],
    },
  },

  tobacco: {
    never: {
      title: 'Tobacco-free',
      whatThisMeans: 'You do not use tobacco.',
      doctorMessage: 'Excellent — staying tobacco-free is one of the best gifts to your health.',
      actionSteps: ['Stay tobacco-free.'],
    },
    former: {
      title: 'Ex-tobacco user',
      whatThisMeans: 'You have quit tobacco — your risk keeps falling over time.',
      doctorMessage: 'Well done for quitting. Stay away from it — the benefits keep adding up.',
      actionSteps: ['Stay quit; avoid triggers and second-hand smoke.'],
    },
    current: {
      title: 'Tobacco use',
      whatThisMeans:
        'Tobacco strongly raises risk of heart disease, stroke, cancer and lung disease.',
      doctorMessage:
        'Quitting tobacco is the single biggest improvement you can make. Help is available — you do not have to do it alone.',
      actionSteps: [
        'Set a quit date this week.',
        'Call a tobacco quitline or ask a doctor for help.',
        'Avoid situations that trigger the habit.',
      ],
      seeDoctor: true,
    },
  },

  alcohol: {
    none: {
      title: 'No alcohol',
      whatThisMeans: 'You do not drink alcohol.',
      doctorMessage: 'Good — avoiding alcohol protects your liver, heart and blood pressure.',
      actionSteps: ['Continue avoiding alcohol.'],
    },
    within: {
      title: 'Alcohol within limits',
      whatThisMeans: 'Your alcohol use is within lower-risk limits.',
      doctorMessage: 'Keep it minimal — less is always better for blood pressure and the liver.',
      actionSteps: ['Keep alcohol low; have alcohol-free days.'],
    },
    harmful: {
      title: 'Harmful alcohol use',
      whatThisMeans:
        'Your alcohol intake is in the harmful range, raising risk for liver, heart and BP problems.',
      doctorMessage:
        'Cutting down will quickly help your blood pressure and overall health. If it is hard to stop, please ask for support.',
      actionSteps: [
        'Reduce the amount and frequency.',
        'Have several alcohol-free days each week.',
        'Seek help if you find it hard to cut down.',
      ],
      seeDoctor: true,
    },
  },

  metabolicSyndrome: {
    present: {
      title: 'Several risks together',
      whatThisMeans:
        'A few problems are showing together — extra tummy fat, high blood pressure, high sugar and high cholesterol. Together they strongly raise your chance of heart disease and diabetes.',
      doctorMessage:
        'The good news: the same simple steps fix all of them — lose tummy fat, walk every day and eat well. Please see a doctor for a full check-up.',
      actionSteps: [
        'See a doctor for blood sugar, BP and lipid evaluation.',
        'Focus on losing waist/belly fat.',
        'Daily activity + DASH-style diet.',
        'Stop tobacco; limit alcohol.',
      ],
      seeDoctor: true,
    },
  },

  highCvdRisk: {
    present: {
      title: 'High heart-attack / stroke risk',
      whatThisMeans:
        'The combination of tobacco, high blood pressure and high sugar/cholesterol puts you at high risk of a heart attack or stroke.',
      doctorMessage:
        'This combination is serious but very treatable. Please see a doctor soon — stopping tobacco and controlling BP and sugar dramatically lowers your risk.',
      actionSteps: [
        'See a doctor promptly for a heart-risk assessment.',
        'Stop tobacco completely — this is the top priority.',
        'Control blood pressure and blood sugar.',
        'Daily activity and a heart-healthy diet.',
      ],
      seeDoctor: true,
    },
  },
};
