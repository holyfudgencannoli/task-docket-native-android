import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface Column {
  key: string;
  title: string;
  render?: (item: any) => React.ReactNode;
}

export interface ScrollableDataTableProps {
  data: any[];
  columns: Column[];
  headerStyle?: ViewStyle;
  rowStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  cellTextStyle?: TextStyle;
  onRowPress?: (item: any) => void; // new prop for row click
}

export const ScrollableDataTable: React.FC<ScrollableDataTableProps> = ({
  data,
  columns,
  headerStyle,
  rowStyle,
  headerTextStyle,
  cellTextStyle,
  onRowPress,
}) => {
  const renderRow = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => onRowPress && onRowPress(item)}
      activeOpacity={0.7}
    >
      <View style={[{ flexDirection: "row", paddingVertical: 8 }, rowStyle]}>
        {columns.map((col) => (
          <View key={col.key} style={{ flex: 1 }}>
            {col.render ? col.render(item) : <Text style={cellTextStyle}>{item[col.key]}</Text>}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View
      style={[{ flexDirection: "row", backgroundColor: "#eee", paddingVertical: 8 }, headerStyle]}
    >
      {columns.map((col) => (
        <View key={col.key} style={{ flex: 1 }}>
          <Text style={[{ fontWeight: "bold" }, headerTextStyle]}>{col.title}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderRow}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      stickyHeaderIndices={[0]}
    />
  );
};
