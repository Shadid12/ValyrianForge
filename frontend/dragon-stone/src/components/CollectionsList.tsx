import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useGetCollections } from "../hooks/useGetCollections";

export default function CollectionsList() {
  const { data, isLoading, isError } = useGetCollections();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching collections.</p>;

  console.log('data --->', data);

  return (
    <div>foo</div>
    //   <List>
    //     {collections.map((collection) => (
    //       <ListItem key={collection.id} disablePadding>
    //         <ListItemButton>
    //           <ListItemIcon>{collection.icon}</ListItemIcon>
    //           <ListItemText primary={collection.name} />
    //         </ListItemButton>
    //       </ListItem>
    //     ))}
    //   </List>
  );
}
