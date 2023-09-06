import MoodProgressBar from "@/shared-ui/MoodProgressBar";
import { api } from "@/utils/api";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Select,
  Skeleton,
  Stack,
  useColorMode,
  Text
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import cookie from "js-cookie";

import React, { useEffect, useState } from "react";
import { AffirmationWrapper } from "../space-affrimations/AffirmationWrapper";

export type IntervalFormat = false | "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year" | undefined


export enum ActivitiesMetricIntervals {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

const getChartScaleUint: (
  interval: ActivitiesMetricIntervals
) => IntervalFormat = (interval) => {
  if (!interval) return;

  let unit: IntervalFormat;

  switch (interval) {
    case ActivitiesMetricIntervals.day:
      unit = "hour";
      break;
    case ActivitiesMetricIntervals.week:
    case ActivitiesMetricIntervals.month:
      unit = "day";
      break;
    case ActivitiesMetricIntervals.year:
      unit = "month";
      break;
    default:
      unit = "hour";
      break;
  }

  return unit;
};

export default function SettingsWrapper() {
  // const { data: session, update } = useSession();
  const { data: profile, isFetched } = api.profile.getProfile.useQuery();
  const { mutate, isLoading: isSaving } =
    api.profile.createOrUpdateProfile.useMutation();

  const { colorMode, toggleColorMode } = useColorMode();

  const updateProfile = (preferences: string[]) => {
    mutate({
      preferences,
    });
  };

  const handleLogout = async () => {
    await signOut();
  };



  const [interval, setInterval] = useState<ActivitiesMetricIntervals>(
    ActivitiesMetricIntervals.day
  );

  const {
    refetch,
    isFetched: isAvgMetricFetched,
    data,
  } = api.metric.getUserMoodMetrics.useQuery({
    interval,
  });

  useEffect(() => {
    const interval = cookie.get("interval") as ActivitiesMetricIntervals;

    if (interval) {
      setInterval(interval);
    }
  }, []);

  useEffect(() => {
    // make api call
    const fetch = async () => await refetch();
    void fetch();
  }, [interval]);

  const handleActivityIntervalChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void = (e) => {
    const interval = e.target.value as ActivitiesMetricIntervals;
    cookie.remove("interval");
    cookie.set("interval", interval, { expires: 1 });
    setInterval(interval);
  };


  return (
    <Box p={4} as={Stack}>
        <Heading
          as="h4"
          size={{ base: "lg", md: "xl" }}
          color={"primary"}
          mb={2}
        >
          Insight
        </Heading>
      <Box>
        <Box display={"flex"} flexDir={{ base: "column", md: "row" }} gap={3}>
          <Card shadow="sm" p={2}>
            <Skeleton isLoaded={isAvgMetricFetched}>
              <CardHeader
                display={"flex"}
                dir="row"
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight={"bold"}>
                  Mood Score
                </Text>
                <Select
                  maxW={100}
                  onChange={handleActivityIntervalChange}
                  value={interval}
                >
                  {Object.values(ActivitiesMetricIntervals).map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </CardHeader>
              <CardBody>
                <Center>
                  {
                    <MoodProgressBar
                      val={
                        data?.avgMoodScore.score
                          ? parseFloat(data?.avgMoodScore.score.toString())
                          : 0
                      }
                    />
                  }
                </Center>
              </CardBody>
            </Skeleton>
          </Card>
        </Box>
      </Box>
      <Card
        dir="row"
        justifyContent={"center"}
        display={"flex"}
        shadow={"sm"}
        p={3}
        maxW={{ base: "100%", md: "400px" }}

      >
        <AffirmationWrapper />
     </Card>
    </Box>
  );
}
