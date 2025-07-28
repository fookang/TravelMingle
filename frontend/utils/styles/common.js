export const fabStyle = (theme, extra = {}) => ({
  position: "absolute",
  right: 28,
  bottom: 28,
  backgroundColor: theme.floatingButton,
  borderRadius: 30,
  width: 56,
  height: 56,
  justifyContent: "center",
  alignItems: "center",
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  ...extra,
});

export const itemStyle = (theme, extra = {}) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: 16,
  marginBottom: 8,
  borderRadius: 8,
  backgroundColor: theme.card,
  ...extra,
});
