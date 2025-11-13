import { Sequelize } from "sequelize";
import { PromptStats, sequelize } from "~/server/models/index";

const updatePromptStats = async (
  status: "Failed" | "Ongoing" | "Successful",
  change: number // positive to add, negative to subtract
) => {
  const t = await sequelize.transaction();
  try {
    // Find row by status
    const stat = await PromptStats.findOne({
      where: { prompt_stats_status: status },
      transaction: t,
      lock: t.LOCK.UPDATE, // row-level lock for safety
    });

    if (!stat) {
      throw new Error(`Status "${status}" not found in prompt_stats table`);
    }

    // Update count (never below 0)
    const newCount = Math.max(
      0,
      (stat.get("prompt_stats_count") as number) + change
    );

    await stat.update({ prompt_stats_count: newCount }, { transaction: t });

    await t.commit();
    return stat;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const getPromptStats = async (client_id: string) => {
  try {
    return await PromptStats.findAll({
      where: {
        client_id: client_id,
      },
      attributes: [
        "prompt_stats_status",
        [
          Sequelize.fn("COUNT", Sequelize.col("prompt_stats_status")),
          "prompt_stats_count",
        ],
      ],
      group: ["prompt_stats_status"],
    });
  } catch (error) {
    throw error;
  }
};

const getSuccessfullyRanPromptStats = async (client_uid: string) => {
  try {
    return (
      (await PromptStats.count({
        where: {
          client_id: client_uid,
          prompt_stats_status: "Successful",
        },
      })) ?? 0
    );
  } catch (error) {
    throw error;
  }
};

export { updatePromptStats, getPromptStats, getSuccessfullyRanPromptStats };
