import { Typography, Box, Grid, TextField, InputLabel, Select, MenuItem, Collapse, Button, Stack } from '@mui/material'
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { errorsInterface, firestoreUser, offerForm } from '../../utils/interfaces';
import { TransitionGroup } from 'react-transition-group';
import { Cancel } from '@mui/icons-material';
import { primary } from '../../utils/colors';
import { makeStyles } from '@mui/styles'




interface OfferFormProps {
    formData: offerForm;
    setFormData: React.Dispatch<React.SetStateAction<offerForm | null>>;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    inputErrors: errorsInterface | undefined;
    userInfo: firestoreUser;
    editMode?: boolean;
}

type tagsProps = {
    tag: string;
    handleDelete: (val: string) => void
}

const Tags: React.FC<tagsProps> = ({ tag, handleDelete }) => {
    return (
        <Box sx={{ background: primary, display: 'flex', p: 1, m: 1, ml: 0, justifyContent: 'center', alignContent: 'center' }}>
            <Stack direction='row' gap={1}>
                <Typography>{tag}</Typography>
                <Cancel sx={{ cursor: "pointer" }} onClick={() => handleDelete(tag)} />
            </Stack>
        </Box>
    )
}

export const OfferForm: React.FC<OfferFormProps> = ({
    formData,
    setFormData,
    handleSubmit,
    inputErrors,
    userInfo,
    tags,
    setTags,
    editMode }) => {

    const useStyles: any = makeStyles(() => ({
        tagsField: {
            display: 'flex',
            flexWrap: 'wrap',
        }
    }))

    const tagRef = useRef<HTMLInputElement>()
    const classes = useStyles()


    const checkKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") e.preventDefault()
    }

    const handleChange = (name: string, value: string) => {
        setFormData((prev: any) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagRef.current) {
            if (tags.includes(tagRef.current.value)) {
                return toast.warn("Tag already included.")
            }
            if (tagRef.current.value.trim().length === 0) {
                return toast.warn("Tag is empty.")
            }
            setTags([...tags, tagRef.current.value])
            tagRef.current.value = ""
        }
    }

    const handleDeleteTag = (val: string) => {
        setTags(tags.filter((tag) => tag !== val))
    }

    return (
        <>
            <Typography component="h1" variant="h4" align="center">
                {editMode ? "Edit" : "Add"} Offer
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} onKeyDown={checkKeyDown} mt={2}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={editMode ? 6 : 12}>
                        <TextField
                            error={inputErrors?.title.error}
                            helperText={inputErrors?.title.text}
                            required
                            id="title"
                            name="title"
                            label="Title"
                            value={formData.title}
                            fullWidth
                            autoComplete="title"
                            variant="standard"
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={editMode ? 6 : 12}>
                        <TextField
                            error={inputErrors?.location.error}
                            helperText={inputErrors?.location.text}
                            required
                            id="location"
                            name="location"
                            label="Location"
                            value={formData.location}
                            fullWidth
                            autoComplete="location"
                            variant="standard"
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={editMode ? 6 : 12}>
                        <InputLabel id="company-label">Comapny</InputLabel>
                        <Select
                            labelId='company-label'
                            label="Comapny"
                            name="companyUid"
                            id="companyUid"
                            value={formData.companyUid}
                            fullWidth
                            variant='standard'
                            required
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        >
                            {userInfo.companies.map((company) => (
                                <MenuItem key={company.uid} value={company.uid}>
                                    {company.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={editMode ? 6 : 12}>
                        <InputLabel id="seniority-label">Seniority</InputLabel>
                        <Select
                            labelId='seniority-label'
                            label="Seniority"
                            name="seniority"
                            id="seniority"
                            value={formData.seniority}
                            fullWidth
                            variant='standard'
                            required
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        >
                            <MenuItem value='Junior'>Junior</MenuItem>
                            <MenuItem value='Mid'>Mid</MenuItem>
                            <MenuItem value='Senior'>Senior</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            inputRef={tagRef}
                            variant='standard'
                            name="techStack"
                            label="Tech stack"
                            placeholder={tags.length < 5 ? "Enter tags" : ''}
                            onKeyDown={(e) => handleAddTag(e)}
                            sx={{ display: 'flex', flexWrap: 'wrap', }}
                            InputProps={{
                                startAdornment: (
                                    <Box component={TransitionGroup} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {tags.map((tag, index) => (
                                            <Collapse key={tag + index} orientation="horizontal">
                                                <Tags tag={tag} handleDelete={handleDeleteTag} />
                                            </Collapse>
                                        ))}
                                    </Box>
                                ),
                                className: classes.tagsField
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            error={inputErrors?.minSalary.error}
                            helperText={inputErrors?.minSalary.text}
                            required
                            value={formData.minSalary}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            id="minSalary"
                            name="minSalary"
                            label="Min Salary"
                            fullWidth
                            autoComplete="minSalary"
                            variant="standard"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            error={inputErrors?.maxSalary.error}
                            helperText={inputErrors?.maxSalary.text}
                            required
                            value={formData.maxSalary}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            id="maxSalary"
                            name="maxSalary"
                            label="Max Salary"
                            fullWidth
                            autoComplete="minSalary"
                            variant="standard"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={inputErrors?.description.error}
                            helperText={inputErrors?.description.text}
                            required
                            value={formData.description}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            fullWidth
                            maxRows={6}
                            minRows={4}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ mt: 3, ml: 1, color: '#fff' }}
                        color="success"
                    >
                        {editMode ? "Save" : "Add"}
                    </Button>
                </Box>
            </Box>
        </>
    )
}
